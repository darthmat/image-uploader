import { Controller, Get, Route, SuccessResponse } from 'tsoa';

interface HealthCheck {
  uptime: number;
  message: string;
  timestamp: number;
}

@Route('healthz')
export class HealthzController extends Controller {
  @Get()
  @SuccessResponse(200, 'OK')
  async healthz(): Promise<HealthCheck> {
    return {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    };
  }
}
