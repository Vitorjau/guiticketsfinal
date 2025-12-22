<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database & Prisma

Environment
- Copy .env.example to .env and set `DATABASE_URL` to your PostgreSQL instance.

Install dependencies
```bash
npm install
```

Prisma setup
```bash
npm run prisma:generate
# Option A: Create tables with migrations
npm run prisma:migrate
# Option B: Quick dev push (no history)
npm run db:push
```

Prisma Studio
```bash
npm run prisma:studio
```

Seed data
```bash
npm run seed
```
Creates an agent (suporte@agente.com), a requester (joao@empresa.com), one group, and two tickets (TCK-001, TCK-002).

Key models
- Users, Tickets, TicketMessages, Attachments, Tags, AssignmentGroups with status/priority enums.

REST endpoints
- `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`
- `POST /tickets`, `GET /tickets`, `GET /tickets/:id`, `PATCH /tickets/:id`, `DELETE /tickets/:id`
- `POST /tickets/:id/assign/:userId`, `POST /tickets/:id/reopen`, `POST /tickets/:id/status`, `POST /tickets/:id/messages`

Cors & Validation
- CORS is enabled for all origins in src/main.ts.
- DTO validation via class-validator is enabled globally.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment (Cloud)

Recommended setup:
- Backend: containerized with Docker (this repo includes a Dockerfile).
- Database: managed Postgres (AWS RDS, Azure Database for PostgreSQL, Supabase, Neon).
- Front-end: static hosting (Vercel, Netlify, or S3+CDN) pointing to the backend API.

Build & run Docker locally
```bash
# from Back-end/
docker build -t guitickets-backend:latest .
# set DATABASE_URL at runtime (managed Postgres)
docker run -e DATABASE_URL="postgresql://<user>:<pass>@<host>:<port>/<db>?schema=public" -e PORT=3000 -p 3000:3000 guitickets-backend:latest
```

Push image (example Docker Hub)
```bash
# login and tag accordingly
docker tag guitickets-backend:latest <your-dockerhub-username>/guitickets-backend:latest
docker push <your-dockerhub-username>/guitickets-backend:latest
```

Deploy
- Use your cloud provider’s container service (Azure Web App for Containers, AWS ECS/Fargate, Render, Railway).
- Set environment variables: `DATABASE_URL`, optional `PORT`.
- Ensure the Postgres instance is reachable (network, firewall, SSL).

Front-end
- Set `VITE_API_URL` to your public backend URL.
- Deploy React app via Vercel/Netlify (build and serve static files).

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
