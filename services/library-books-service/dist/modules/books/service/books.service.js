"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_entity_1 = require("../entities/book.entity");
const book_copy_entity_1 = require("../entities/book-copy.entity");
const book_review_entity_1 = require("../entities/book-review.entity");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const config_service_1 = require("../../library-config/service/config.service");
const redis_emitter_service_1 = require("../../redis-emitter/redis-emitter.service");
let BooksService = BooksService_1 = class BooksService {
    constructor(bookModel, bookReviewModel, bookCopyModel, httpService, configService, redisEmitter) {
        this.bookModel = bookModel;
        this.bookReviewModel = bookReviewModel;
        this.bookCopyModel = bookCopyModel;
        this.httpService = httpService;
        this.configService = configService;
        this.redisEmitter = redisEmitter;
        this.logger = new common_1.Logger(BooksService_1.name);
    }
    async logActivity(adminId, action, entityId, details) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3002';
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${membersServiceUrl}/activities/logs`, {
                adminId,
                action,
                entityType: 'BOOK',
                entityId,
                details
            }));
        }
        catch (error) {
            this.logger.error(`Failed to log activity to member service: ${error}`);
        }
    }
    async notifyAdmins(type, title, message) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3002';
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${membersServiceUrl}/notifications/admin`, {
                type,
                title,
                message
            }));
        }
        catch (error) {
            this.logger.error(`Failed to broadcast to admins: ${error}`);
        }
    }
    async validateStorageCapacity(rackNumber, shelfNumber, additionalQuantity, excludeBookId) {
        if (!rackNumber)
            return;
        const query = { rackNumber };
        if (excludeBookId) {
            query._id = { $ne: excludeBookId };
        }
        const booksInRack = await this.bookModel.find(query).exec();
        const config = await this.configService.getConfig();
        const currentRackTotal = booksInRack.reduce((sum, book) => sum + (book.quantity || 0), 0);
        const MAX_RACK_CAPACITY = config?.maxRackCapacity || 50;
        if (currentRackTotal + additionalQuantity > MAX_RACK_CAPACITY) {
            throw new common_1.BadRequestException(`Rack ${rackNumber} capacity exceeded (${currentRackTotal + additionalQuantity}/${MAX_RACK_CAPACITY}).`);
        }
        if (shelfNumber) {
            const currentShelfTotal = booksInRack
                .filter(b => b.shelfNumber === shelfNumber)
                .reduce((sum, book) => sum + (book.quantity || 0), 0);
            const MAX_SHELF_CAPACITY = config?.maxShelfCapacity || 10;
            if (currentShelfTotal + additionalQuantity > MAX_SHELF_CAPACITY) {
                throw new common_1.BadRequestException(`Shelf ${shelfNumber} in Rack ${rackNumber} is full (${currentShelfTotal + additionalQuantity}/${MAX_SHELF_CAPACITY}).`);
            }
        }
    }
    async create(createBookDto, adminId, role) {
        const count = await this.bookModel.countDocuments().exec();
        createBookDto.bookId = `BK-${count + 1}`;
        if (createBookDto.rackNumber) {
            await this.validateStorageCapacity(createBookDto.rackNumber, createBookDto.shelfNumber || 'S1', createBookDto.quantity || 1);
        }
        const createdBook = new this.bookModel({
            ...createBookDto,
            createdBy: adminId,
        });
        const savedBook = await createdBook.save();
        this.logger.log(`Book saved: ${savedBook._id}, bookId: ${savedBook.bookId}`);
        const copies = [];
        const quantity = savedBook.quantity || 1;
        for (let i = 1; i <= quantity; i++) {
            copies.push({
                bookId: savedBook._id,
                copyNumber: `${savedBook.bookId}-C${i.toString().padStart(2, '0')}`,
                status: savedBook.status || book_entity_1.BookStatus.AVAILABLE,
                condition: savedBook.condition || book_entity_1.BookCondition.GOOD,
                addedBy: adminId,
            });
        }
        try {
            const insertedCopies = await this.bookCopyModel.insertMany(copies);
            this.logger.log(`Successfully created ${insertedCopies.length} copies for book ${savedBook.bookId}`);
        }
        catch (copyError) {
            this.logger.error(`Failed to create copies for book ${savedBook.bookId}: ${copyError.message}`);
        }
        if (adminId) {
            await this.logActivity(adminId, 'BOOKSADDED', savedBook.bookId, { title: savedBook.title });
            if (role === 'staff') {
                await this.notifyAdmins('NEW_BOOK_ADDED', 'New Book Added to Library', `A new book "${savedBook.title}" (ID: ${savedBook.bookId}) has been successfully added to the catalog by staff.`);
            }
        }
        await this.redisEmitter.emit('BOOK_CREATED', savedBook);
        await this.redisEmitter.emit('BOOKS_UPDATED', { type: 'create', book: savedBook });
        return savedBook;
    }
    async findAll(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } },
                    { isbn: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const [books, total] = await Promise.all([
            this.bookModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit).lean().exec(),
            this.bookModel.countDocuments(query).exec(),
        ]);
        const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';
        const bookIds = books.map(b => b._id.toString());
        let availabilityMap = {};
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${issuesServiceUrl}/issues/bulk-book-counts`, { bookIds }));
            availabilityMap = response.data?.counts || {};
        }
        catch (error) {
            this.logger.error(`Failed to fetch bulk availability: ${error.message}`);
        }
        let reviewCountsMap = {};
        try {
            const reviewCounts = await this.bookReviewModel.aggregate([
                { $match: { bookId: { $in: bookIds.map(id => new mongoose_2.Types.ObjectId(id)) } } },
                { $group: { _id: '$bookId', count: { $sum: 1 } } }
            ]).exec();
            reviewCountsMap = reviewCounts.reduce((map, item) => {
                map[item._id.toString()] = item.count;
                return map;
            }, {});
        }
        catch (error) {
            this.logger.error(`Failed to fetch bulk review counts: ${error.message}`);
        }
        const updatedBooks = books.map((book) => {
            const issuedCount = availabilityMap[book._id.toString()] || 0;
            const damagedCount = book.damagedQuantity || 0;
            return {
                ...book,
                available: Math.max(0, (book.quantity || 0) - issuedCount - damagedCount),
                totalReviews: reviewCountsMap[book._id.toString()] || 0,
                rating: Number((book.rating || 0).toFixed(1)),
            };
        });
        return {
            data: updatedBooks,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const book = await this.bookModel.findById(id).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/count/book/${book._id}`));
            const issuedCount = response.data?.count || 0;
            const damagedCount = book.damagedQuantity || 0;
            return { ...book.toObject(), available: Math.max(0, book.quantity - issuedCount - damagedCount) };
        }
        catch (error) {
            console.log("ISSUE COUNT FETCH FAILED:", error);
            const damagedCount = book.damagedQuantity || 0;
            return { ...book.toObject(), available: Math.max(0, book.quantity - damagedCount) };
        }
    }
    async findByBookId(bookId) {
        const book = await this.bookModel.findOne({ bookId }).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        return book;
    }
    async findCopiesByBookId(bookId) {
        const book = await this.bookModel.findById(bookId).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        return this.bookCopyModel.find({ bookId: book._id }).exec();
    }
    async findCopiesByTitleId(id) {
        const book = await this.bookModel.findById(id).exec();
        if (!book)
            return [];
        const copies = await this.bookCopyModel.find({ bookId: book._id }).exec();
        if (copies.length === 0 && book.quantity > 0) {
            this.logger.log(`No copies found for book ${book.bookId}, generating ${book.quantity} copies now...`);
            const newCopies = [];
            for (let i = 1; i <= book.quantity; i++) {
                newCopies.push({
                    bookId: book._id,
                    copyNumber: `${book.bookId}-C${i.toString().padStart(2, '0')}`,
                    status: book_entity_1.BookStatus.AVAILABLE,
                    condition: book_entity_1.BookCondition.GOOD,
                });
            }
            try {
                return await this.bookCopyModel.insertMany(newCopies);
            }
            catch (err) {
                this.logger.error(`Failed to auto-generate copies: ${err.message}`);
                return [];
            }
        }
        return copies;
    }
    async update(id, updateBookDto, adminId) {
        const currentBook = await this.bookModel.findById(id).exec();
        if (!currentBook) {
            throw new common_1.NotFoundException('Book not found');
        }
        if (updateBookDto.rackNumber || updateBookDto.shelfNumber || updateBookDto.quantity !== undefined) {
            const targetRack = updateBookDto.rackNumber || currentBook.rackNumber;
            const targetShelf = updateBookDto.shelfNumber || currentBook.shelfNumber || 'S1';
            const targetQuantity = updateBookDto.quantity !== undefined ? updateBookDto.quantity : currentBook.quantity;
            await this.validateStorageCapacity(targetRack, targetShelf, targetQuantity, id);
        }
        const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        if (adminId) {
            await this.logActivity(adminId, 'UPDATE', book.bookId, { title: book.title, updatedFields: Object.keys(updateBookDto) });
        }
        await this.redisEmitter.emit('BOOK_UPDATED', book);
        await this.redisEmitter.emit('BOOKS_UPDATED', { type: 'update', book });
        return book;
    }
    async updateStatus(id, status) {
        const book = await this.bookModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        this.logger.log(`Book ${id} status updated to ${status}`);
        return book;
    }
    async updateCopyStatus(copyNumber, status, condition) {
        const update = { status };
        if (condition) {
            update.condition = condition;
        }
        const copy = await this.bookCopyModel.findOneAndUpdate({ copyNumber }, update, { new: true }).exec();
        if (!copy) {
            throw new common_1.NotFoundException(`Book copy ${copyNumber} not found`);
        }
        return copy;
    }
    async updateConditionQuantity(bookId, condition, change) {
        const update = {};
        if (condition === 'Damaged') {
            update.$inc = { damagedQuantity: change };
        }
        else if (condition === 'Lost') {
            update.$inc = { lostQuantity: change, quantity: -change };
        }
        const book = await this.bookModel.findByIdAndUpdate(bookId, update, { new: true }).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        if (book.quantity === 0 && condition === 'Lost') {
            book.status = book_entity_1.BookStatus.LOST;
            await book.save();
        }
        await this.redisEmitter.emit('BOOKS_UPDATED', { type: 'update', book });
        return book;
    }
    async remove(id, adminId) {
        const book = await this.bookModel.findById(id).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        if (book.status === 'issued') {
            throw new common_1.BadRequestException('Cannot delete a book that is currently issued. Please return the book first.');
        }
        await this.bookModel.findByIdAndDelete(id).exec();
        if (adminId) {
            await this.logActivity(adminId, 'DELETE', book.bookId, { title: book.title });
        }
        await this.redisEmitter.emit('BOOK_DELETED', { id, bookId: book.bookId });
        await this.redisEmitter.emit('BOOKS_UPDATED', { type: 'delete', id });
    }
    async search(query) {
        return this.bookModel.find({ $text: { $search: query } }).exec();
    }
    async findAllCategories() {
        const categories = await this.bookModel.distinct('category').exec();
        return categories.sort();
    }
    async findByCategory(category) {
        return this.bookModel.find({ category }).exec();
    }
    async findByRack(rackNumber) {
        return this.bookModel.find({ rackNumber }).exec();
    }
    async createReview(createReviewDto, token) {
        const existingReview = await this.bookReviewModel.findOne({
            bookId: new mongoose_2.Types.ObjectId(createReviewDto.bookId),
            memberId: new mongoose_2.Types.ObjectId(createReviewDto.memberId),
        }).exec();
        if (existingReview) {
            throw new common_1.ConflictException('Review already exists for this book by this member');
        }
        let memberName = "Member";
        const memberServiceUrl = "http://library-api-gateway:3000/library/members";
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${memberServiceUrl}/members/${createReviewDto.memberId}`, {
                headers: {
                    Authorization: token,
                }
            }));
            memberName = response.data?.data?.name || "Member";
        }
        catch (error) {
            console.log("Failed to fetch member name:", error.message);
        }
        const review = new this.bookReviewModel({
            ...createReviewDto,
            bookId: new mongoose_2.Types.ObjectId(createReviewDto.bookId),
            memberId: new mongoose_2.Types.ObjectId(createReviewDto.memberId),
            memberName,
        });
        const savedReview = await review.save();
        await this.redisEmitter.emit('REVIEW_CREATED', savedReview);
        return savedReview;
    }
    async findReviewsByUser(userId) {
        return this.bookReviewModel.find({ memberId: new mongoose_2.Types.ObjectId(userId) }).populate('bookId').exec();
    }
    async checkReview(bookId, memberId) {
        const review = await this.bookReviewModel.findOne({
            bookId: new mongoose_2.Types.ObjectId(bookId),
            memberId: new mongoose_2.Types.ObjectId(memberId),
        });
        return { reviewed: !!review };
    }
    async findReviewsByBook(bookId) {
        return this.bookReviewModel.find({ bookId: new mongoose_2.Types.ObjectId(bookId) }).exec();
    }
    async toggleLike(reviewId, userId) {
        const review = await this.bookReviewModel.findById(reviewId);
        if (!review)
            throw new Error("Review not found");
        if (!userId) {
            throw new Error("User not Authenticated");
        }
        const alreadyLiked = review.likedBy.some((id) => id.toString() === userId);
        if (alreadyLiked) {
            review.likedBy = review.likedBy.filter(id => id !== userId);
            review.likeCount = Math.max(0, review.likeCount - 1);
        }
        else {
            review.likedBy.push(userId);
            review.likeCount += 1;
        }
        await review.save();
        return review;
    }
    async findReviewsByMember(memberId) {
        return this.bookReviewModel.find({ memberId: new mongoose_2.Types.ObjectId(memberId) }).sort({ reviewDate: -1 }).exec();
    }
    async updateReview(reviewId, userId, updateData) {
        const review = await this.bookReviewModel.findById(reviewId);
        if (!review) {
            throw new Error('Review not found');
        }
        if (review.memberId.toString() !== userId) {
            throw new Error('Unauthorized');
        }
        review.rating = updateData.rating;
        review.reviewTitle = updateData.reviewTitle;
        review.review = updateData.review;
        await review.save();
        return review;
    }
    async deleteReview(reviewId, userId, role) {
        const review = await this.bookReviewModel.findById(reviewId);
        if (!review) {
            throw new Error('Review not found');
        }
        if (role !== 'admin' && role !== 'staff' && review.memberId.toString() !== userId) {
            throw new Error('Unauthorized');
        }
        await this.bookReviewModel.findByIdAndDelete(reviewId);
    }
    async getCollectionStats() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [categoryStats, bookTypeStats, newArrivals, total] = await Promise.all([
            this.bookModel.aggregate([
                { $group: { _id: { $toLower: "$category" }, count: { $sum: 1 } } }
            ]).exec(),
            this.bookModel.aggregate([
                { $group: { _id: { $toLower: "$bookType" }, count: { $sum: 1 } } }
            ]).exec(),
            this.bookModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }).exec(),
            this.bookModel.countDocuments().exec(),
        ]);
        const stats = {
            newArrivals,
            bestSellers: 0,
            reference: 0,
            children: 0,
            academic: 0,
            ebooks: 0,
            total
        };
        categoryStats.forEach(cat => {
            const name = cat._id || "";
            if (name.includes("reference"))
                stats.reference += cat.count;
            if (name.includes("children") || name.includes("kid"))
                stats.children += cat.count;
            if (name.includes("academic") || name.includes("education"))
                stats.academic += cat.count;
            if (name.includes("e-book") || name.includes("ebook") || name.includes("digital"))
                stats.ebooks += cat.count;
        });
        bookTypeStats.forEach(bt => {
            const name = bt._id || "";
            if (name.includes("reference"))
                stats.reference += bt.count;
            if (name.includes("e-book") || name.includes("ebook") || name.includes("digital"))
                stats.ebooks += bt.count;
        });
        stats.reference = await this.bookModel.countDocuments({
            $or: [
                { category: { $regex: /reference/i } },
                { bookType: { $regex: /reference/i } }
            ]
        }).exec();
        stats.bestSellers = await this.bookModel.countDocuments({ rating: { $gte: 4 } }).exec() || Math.floor(total * 0.1);
        return stats;
    }
    async getTopReviews() {
        return this.bookReviewModel.aggregate([
            {
                $match: {
                    status: 'Published',
                    rating: { $gte: 3 }
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'book'
                }
            },
            {
                $unwind: {
                    path: '$book',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    memberName: 1,
                    rating: 1,
                    reviewTitle: 1,
                    review: 1,
                    reviewDate: 1,
                    bookTitle: '$book.title',
                    bookImage: '$book.images'
                }
            },
            { $sort: { reviewDate: -1 } },
            { $limit: 10 }
        ]).exec();
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = BooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_entity_1.Book.name)),
    __param(1, (0, mongoose_1.InjectModel)(book_review_entity_1.BookReview.name)),
    __param(2, (0, mongoose_1.InjectModel)(book_copy_entity_1.BookCopy.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        axios_1.HttpService,
        config_service_1.ConfigService,
        redis_emitter_service_1.RedisEmitterService])
], BooksService);
//# sourceMappingURL=books.service.js.map