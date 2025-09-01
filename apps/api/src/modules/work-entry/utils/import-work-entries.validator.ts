import { BadRequestException } from '@nestjs/common';

export class ImportWorkEntryValidator {
  static validate(
    row: Record<string, unknown>,
    rowNum: number,
  ): { startedAt: Date; endedAt: Date; title: string; description: string } {
    const {
      Title: title,
      Description: description,
      'Start Date': startedAt,
      'End Date': endedAt,
    } = row;

    // TODO: consider custom excpetions, mapping

    if (!title || !startedAt || !endedAt) {
      throw new BadRequestException(`Missing required fields at row ${rowNum}`);
    }

    if (!(startedAt instanceof Date) || !(endedAt instanceof Date)) {
      throw new BadRequestException(`Invalid datetime format at row ${rowNum}`);
    }

    if (endedAt <= startedAt) {
      throw new BadRequestException(
        `End time must be after start time at row ${rowNum}`,
      );
    }

    if (
      startedAt.getFullYear() !== endedAt.getFullYear() ||
      startedAt.getMonth() !== endedAt.getMonth() ||
      startedAt.getDate() !== endedAt.getDate()
    ) {
      throw new BadRequestException(
        `Start and end must be on the same day at row ${rowNum}`,
      );
    }

    if (startedAt.getHours() < 8) {
      throw new BadRequestException(
        `Start time cannot be earlier than 08:00 at row ${rowNum}`,
      );
    }

    if (!this.isQuarterHour(startedAt) || !this.isQuarterHour(endedAt)) {
      throw new BadRequestException(
        `Start and end times must be in 15-minute intervals at row ${rowNum}`,
      );
    }

    const lastIntervalEnd = new Date(startedAt);
    lastIntervalEnd.setHours(20, 15, 0, 0);
    if (endedAt > lastIntervalEnd) {
      throw new BadRequestException(
        `End time cannot be later than 20:15 at row ${rowNum}`,
      );
    }

    return {
      title: String(title),
      description: description ? String(description) : '',
      startedAt,
      endedAt,
    };
  }

  private static isQuarterHour(date: Date): boolean {
    return date.getMinutes() % 15 === 0;
  }
}
