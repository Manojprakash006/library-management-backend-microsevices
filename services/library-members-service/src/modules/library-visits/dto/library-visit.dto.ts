export class CheckInDto {
  memberId: string;
  purpose?: string;
  bookId?: string;
  notes?: string;
}

export class CheckOutDto {
  visitId: string;
  notes?: string;
}
