import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

// ✅ Финализированная логика KYC-потока
// 	1.	👤 Юзер логинится через Public API
// 	•	Получает accessToken, который будет использовать для авторизации в других сервисах.
// 	2.	📩 Юзер отправляет запрос на роль Property Owner
// 	•	Делает HTTP-запрос на KYC-сервис (через gateway/proxy public → kyc).
// 	•	Прикладывает токен (JWT).
// 	3.	🔐 KYC-сервис валидирует токен
// 	•	Использует тот же JWT_SECRET, что и Public API.
// 	•	Распаковывает userId, email, role из токена.
// 	4.	🗃️ KYC-сервис сохраняет запрос в свою базу
// 	•	Статус запроса: pending.
// 	•	Связка userId + причина запроса.
// 	5.	📤 KYC отправляет ивент в Kafka: kyc.request.created
// 	•	Потребители:
// 	•	NotificationService (уведомляет юзера / админа).
// 	•	AdminService (подгружает заявку в админку).
// 	6.	🧑‍💼 Админ обрабатывает заявку через Admin-панель
// 	•	Отправляет HTTP-запрос на KYC: /kyc/:id/decision
// 	•	Payload: { status: 'approved' | 'rejected', adminId }.
// 	7.	📤 KYC отправляет два Kafka ивента:
// 	•	kyc.status.updated → Public API
// 	•	Public обновляет роль пользователя (property_owner) или отказывает.
// 	•	kyc.status.updated → NotificationService
// 	•	Отправляет email/SMS юзеру о решении.

// ✅ Микросервисы

// createMicroservice() vs create()
// createMicroservice() - для микросервисов, но из минусов это отсутсвие HTTP, и нет возможности использовать проксирование через nginx/aws
// create() - Универсальность, но из минусов это настройка инфраструктуры, которая не нужна для микросервисов, и то что по памяти немного тяжелее

// noAck true ( which is default ) options is used to disable message acknowledgement, so that the message is not removed from the queue until the consumer acknowledges it
// *message acknowledgement* - is a process of confirming that the message has been processed successfully.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api/kyc';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
