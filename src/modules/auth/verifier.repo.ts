import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Verifier } from './verifier.schema';

@Injectable()
export class VerifierRepo {
  constructor(
    @InjectModel(Verifier.name)
    private readonly model: Model<Verifier>,
  ) {}

  async create(info: Verifier): Promise<MongoDoc<Verifier>> {
    return await this.model.create(info);
  }

  async getById(id: string): Promise<MongoDoc<Verifier> | null> {
    return this.model.findByIdAndUpdate(id, {
      $inc: { count: 1 },
    });
  }

  async getByEmail(email: string): Promise<MongoDoc<Verifier> | null> {
    return this.model.findOneAndUpdate({ email }, { $inc: { count: 1 } });
  }
}
