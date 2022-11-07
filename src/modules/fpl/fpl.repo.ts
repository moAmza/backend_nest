import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { NetworkError } from '../../errors/network-error';
import { TypeFplBootstrapDto } from './dtos/type-fpl-bootstrap.dto';

@Injectable()
export class FplRepo {
  constructor(private readonly httpService: HttpService) {}

  private baseUrl = 'https://fantasy.premierleague.com/api/';

  async getBootstrap(): Promise<NetworkError | TypeFplBootstrapDto> {
    return lastValueFrom(
      this.httpService
        .get(this.baseUrl + 'bootstrap-static/')
        .pipe(map((res) => res.data as TypeFplBootstrapDto))
        .pipe(catchError(async () => new NetworkError())),
    );
  }
}
