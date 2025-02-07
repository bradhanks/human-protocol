import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { StorageClient, KVStoreUtils } from '@human-protocol/sdk';
import * as jwt from 'jsonwebtoken';
import { JwtUser } from '../../../common/types/jwt';
import { JWT_KVSTORE_KEY, KYC_APPROVED } from '../../../common/constant';
import { Role } from '../../../common/enums/role';
import { Web3Service } from 'src/modules/web3/web3.service';

@Injectable()
export class JwtHttpStrategy extends PassportStrategy(Strategy, 'jwt-http') {
  constructor(private readonly web3Service: Web3Service) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (
        request: any,
        rawJwtToken: any,
        done: any,
      ) => {
        try {
          const payload = jwt.decode(rawJwtToken);
          const chainId = this.web3Service.getValidChains()[0];

          const url = await KVStoreUtils.getFileUrlAndVerifyHash(
            chainId,
            (payload as any).reputation_network,
            JWT_KVSTORE_KEY,
          );
          const publicKey = await StorageClient.downloadFileFromUrl(url);

          done(null, publicKey);
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
      passReqToCallback: true,
    });
  }

  public async validate(
    @Req() request: any,
    payload: {
      role: string;
      email: string;
      wallet_address: string;
      kyc_status: string;
      reputation_network: string;
    },
  ): Promise<JwtUser> {
    if (!payload.email) {
      throw new UnauthorizedException('Invalid token: missing email');
    }

    if (!payload.role) {
      throw new UnauthorizedException('Invalid token: missing role');
    }

    if (!Object.values(Role).includes(payload.role as Role)) {
      throw new UnauthorizedException(
        `Invalid token: unrecognized role "${payload.role}"`,
      );
    }

    const role: Role = payload.role as Role;

    if (role !== Role.HumanApp) {
      if (!payload.kyc_status) {
        throw new UnauthorizedException('Invalid token: missing KYC status');
      }

      if (!payload.wallet_address) {
        throw new UnauthorizedException('Invalid token: missing address');
      }

      if (payload.kyc_status !== KYC_APPROVED) {
        throw new UnauthorizedException(
          `Invalid token: expected KYC status "${KYC_APPROVED}", but received "${payload.kyc_status}"`,
        );
      }
    }

    return {
      role: role,
      address: payload.wallet_address,
      email: payload.email,
      kycStatus: payload.kyc_status,
      reputationNetwork: payload.reputation_network,
    };
  }
}
