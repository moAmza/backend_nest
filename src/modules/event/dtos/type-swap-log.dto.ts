import mongoose from 'mongoose';

export class TypeSwapLogDto {
  pastPlayerId: mongoose.Types.ObjectId;
  nextPlayerId: mongoose.Types.ObjectId;
  positionNum1: number;
  positionNum2: number;
}
