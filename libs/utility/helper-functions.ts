import { CreateUserDtoWithPassword } from 'libs/building-block/RequestableDTOs';
import {
  PromotionGroupType,
  PromotionLogoType,
  PromotionStatus,
  PromotionType,
  RuleType,
  UserRole,
} from 'libs/building-block/constants';
import { faker } from '@faker-js/faker';
import { CreatePromotionWithTierRulesDto } from 'libs/building-block/RequestableDTOs/promotion/create-promotion.dto';
import { CreateCategoryDto } from 'libs/building-block/RequestableDTOs/category/create-category.dto';
import { CreateProductDto } from 'libs/building-block/RequestableDTOs/product/create-product.dto';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

export const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateKey = async (extension: string): Promise<string> => {
  const random = uuidv4();
  const key = `${random}.${extension}`;
  return key;
};

export function createRandomUser(): CreateUserDtoWithPassword {
  const roles = [
    UserRole.Customer,
    UserRole.Employee,
    UserRole.SubAdmin,
    // UserRole.Admin,
  ];
  const randomNum = randomIntFromInterval(0, roles.length - 1);

  return {
    createdby: faker.string.uuid(),
    firstName: faker.person.firstName().toLowerCase(),
    lastName: faker.person.lastName().toLowerCase(),
    email: faker.internet.email(),
    region: faker.location.city(),
    phoneNumber: faker.phone.number(),
    designation: faker.person.jobType(),
    password: '12345',
    userRole: [roles[randomNum]],
  };
}

export function createRandomPromotion(): CreatePromotionWithTierRulesDto {
  const types = [PromotionType.RewardBased, PromotionType.TargetBased];
  const randomNum = randomIntFromInterval(0, types.length - 1);
  const ruleTypes = [RuleType.Purchase, RuleType.Sales];
  const randomRuleNum = randomIntFromInterval(0, types.length - 1);
  const statusType = [
    PromotionStatus.Pending,
    PromotionStatus.Inprogress,
    PromotionStatus.Completed,
  ];
  const randomStatusNum = randomIntFromInterval(0, statusType.length - 1);

  const groupTypes = [PromotionGroupType.Customer, PromotionGroupType.Employee];
  const randomGroupTypeNum = randomIntFromInterval(0, groupTypes.length - 1);

  return {
    name: faker.company.name().toLowerCase(),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    type: types[randomNum],
    promotionStatus: statusType[randomStatusNum],
    tenant: faker.string.uuid(),
    trip: faker.string.uuid(),
    groupType: groupTypes[randomGroupTypeNum],
    logo: PromotionLogoType.SALES_INCENTIVE,
    tremendousRateAmount: 1,
    tremendousRatePoint: 1,
    displayMerchantProduct: false,
    rule: {
      noExpiry: true,
      // pointConversionRate: faker.number.float(),
      conversionRateAmount: faker.number.int({ min: 10, max: 200 }),
      conversionRatePoint: faker.number.int({ min: 10, max: 200 }),
      pointsRequired: faker.number.int({ min: 10, max: 200 }),
      pointsAwardManually: true,
      ruleType: ruleTypes[randomRuleNum],
      target: faker.number.int({ min: 10, max: 200 }),
      expiryDate: faker.date.future(),
    },
    tiers: [
      {
        colorScheme: faker.color.rgb(),
        name: faker.lorem.word().toLowerCase(),
        maximumPoints: faker.number.int({ min: 10, max: 100 }),
        minimumPoints: faker.number.int({ min: 10, max: 100 }),
      },
      {
        colorScheme: faker.color.rgb(),
        name: faker.lorem.word().toLowerCase(),
        maximumPoints: faker.number.int({ min: 10, max: 100 }),
        minimumPoints: faker.number.int({ min: 10, max: 100 }),
      },
      {
        colorScheme: faker.color.rgb(),
        name: faker.lorem.word().toLowerCase(),
        maximumPoints: faker.number.int({ min: 10, max: 100 }),
        minimumPoints: faker.number.int({ min: 10, max: 100 }),
      },
    ],
  };
}

export function converToDecimalNumber(
  num: number,
  decimalPoints: number,
): number {
  const temp = num.toFixed(decimalPoints);
  const tempNum = parseFloat(temp);
  return tempNum;
}

export function createRandomCategory(): CreateCategoryDto {
  return {
    name: faker.commerce.department(),
    imageKey: 'f8a88cd9-b13d-4b21-85c6-10a12d81bf25.png',
    imageName: 'Demo.png',
  };
}

export function createRandomSubCategory(): CreateCategoryDto {
  return {
    name: faker.commerce.product(),
    imageKey: 'f8a88cd9-b13d-4b21-85c6-10a12d81bf25.png',
    imageName: 'Demo.png',
  };
}

export function createRandomProduct(): CreateProductDto {
  return {
    category: 'abc',
    description: faker.lorem.sentence(),
    points: faker.number.int({ min: 50, max: 200 }),
    name: faker.commerce.productName(),
    subCategory: 'abc',
    imageKey: 'f8a88cd9-b13d-4b21-85c6-10a12d81bf25.png',
    imageName: `${faker.science.chemicalElement()}.png`,
  };
}

export const convertToDateInRequiredFormat = (dateString) => {
  let parsedDate: Date | moment.Moment;
  if (!isNaN(dateString)) {
    parsedDate = new Date((Number(dateString) - 25569) * 86400 * 1000);
    return parsedDate;
  } else {
    parsedDate = moment(dateString, [
      'YYYY-MM-DD',
      'MM/DD/YYYY',
      'MM-DD-YYYY',
      'DD-MM-YYYY',
      'YYYY-MM-DD HH:mm:ss',
      'MM/DD/YYYY HH:mm:ss',
    ]);
    const dateObject = parsedDate.toDate();
    return dateObject;
  }
};

export function getDateRange(): { startDate: string; endDate: string } {
  // Get the current date using moment
  const endDate = moment().format('YYYY-MM-DD');

  // Calculate the start date as exactly 12 months before the current date, adjusting for the day
  const startDate = moment()
    .subtract(12, 'months')
    .startOf('month')
    .add(1, 'month')
    .format('YYYY-MM-DD');

  return {
    startDate,
    endDate,
  };
}

export const fillMissingMonths = (
  data: Array<{
    year: string;
    month: string;
    monthName: string;
    totalPoints: string;
  }>,
  startDate: string,
  endDate: string,
): Array<{
  year: string;
  month: string;
  monthName: string;
  totalPoints: number;
}> => {
  // Create a map for existing data
  const resultMap = new Map<
    string,
    { monthName: string; year: string; totalPoints: number }
  >();

  // Populate map with existing data
  data.forEach(({ year, month, monthName, totalPoints }) => {
    const monthStr = `${year}-${month}`;
    resultMap.set(monthStr, {
      monthName: monthName.trim(), // Ensure monthName is trimmed
      year,
      totalPoints: parseInt(totalPoints, 10),
    });
  });

  // Use moment to handle date ranges
  const start = moment(startDate).startOf('month');
  const end = moment(endDate).endOf('month');
  const filledResults: Array<{
    year: string;
    month: string;
    monthName: string;
    totalPoints: number;
  }> = [];

  const current = start.clone();

  while (current <= end) {
    const year = current.format('YYYY');
    const month = current.format('MM');
    const monthStr = `${year}-${month}`;

    // Generate month name directly using moment
    const monthName = current.format('MMMM');

    filledResults.push({
      year,
      month,
      monthName,
      totalPoints: resultMap.get(monthStr)?.totalPoints || 0,
    });

    current.add(1, 'month');
  }

  return filledResults;
};

export const calculateProgress = (startDate: Date, endDate: Date) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const now = moment();

  if (now.isBefore(start)) {
    // Current date is before the start date, progress is 0%
    return {
      progress: 0,
    };
  } else if (now.isAfter(end)) {
    // Current date is after the end date, progress is 100%
    return {
      progress: 100,
    };
  } else {
    // Current date is between start and end date
    const totalDuration = end.diff(start, 'days');
    const elapsedDuration = now.diff(start, 'days');
    const progress = Math.min((elapsedDuration / totalDuration) * 100, 100);
    return {
      progress,
    };
  }
};

// Example usage:
