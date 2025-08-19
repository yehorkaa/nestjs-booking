import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  brokerUrl: process.env.KAFKA_BROKER_URL,
  clientId: process.env.KAFKA_CLIENT_ID,
  groupId: process.env.KAFKA_GROUP_ID,
}));