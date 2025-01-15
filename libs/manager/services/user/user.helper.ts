import { HttpStatus, Injectable } from '@nestjs/common';
import { Password } from '../password/password.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as moment from 'moment';
import { ServiceError } from 'libs/building-block/filters/service-error';
import { Tenant } from '../tenant/tenant.entity';
import { User } from './user.entity';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { SEND_MAIL, UserRole } from 'libs/building-block/constants';
import { createSubAdminReAssignHtml } from 'libs/utility/email-templates';

@Injectable()
export class UserHelperService {
  constructor(
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectQueue(SEND_MAIL) private sendMailQueue: Queue,
  ) {}

  async subAdminReAssignedEmail(data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userRole: UserRole[];
    tenantName: string;
    groupName: string;
  }) {
    console.log('🚀 ~ data:', data);
    try {
      let html: string;
      let subject: string;
      if (data.userRole.includes(UserRole.SubAdmin)) {
        html = createSubAdminReAssignHtml(
          data.firstName,
          data.groupName,
          data.tenantName,
        );
        subject = `Assigned as Sub Admin to ${data.groupName} group`;
        // send into the queue
        this.sendMailQueue.add(SEND_MAIL, {
          queryParameters: {
            email: data.email,
            subject,
            html: html,
          },
        });
      }
    } catch (error) {
      throw new ServiceError(
        'User',
        'Error While Sending email to User!',
        error.message ?? 'Error While Sending email to User!',
        error.status ?? 500,
      );
    }
  }

  async generatePasswordResetToken(email: string) {
    try {
      const Token = encodeURI(randomBytes(64).toString('hex'));
      const Expiry = moment().add(2, 'hours');
      const passwordToken = await this.passwordRepository.save({
        token: Token,
        expiry: Expiry,
        email: email,
        status: 1,
      });

      return passwordToken;
    } catch (error) {
      throw new ServiceError(
        'User',
        'Error in creating token!',
        error.message ?? 'Error in creating token!',
        error.status ?? 500,
      );
    }
  }

  async checkTenantLicenses(tenant: Tenant) {
    const { licenses, id } = tenant;

    const [, count] = await this.userRepository.findAndCount({
      relations: {
        tenant: true,
      },
      where: {
        isDeleted: false,
        isActive: true,
        tenant: {
          id,
        },
      },
    });

    if (count >= licenses) {
      throw new ServiceError(
        'UserService',
        'User license quota exceed,kindly contact your tenant!',
        'User license quota exceed,kindly contact your tenant!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
