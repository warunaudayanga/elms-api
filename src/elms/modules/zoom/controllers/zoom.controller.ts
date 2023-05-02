/* eslint-disable no-console */
import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Endpoint } from "../../../../core/enums";
import { Request, Response } from "express";
import { GenerateSignatureDto } from "../dtos/generate-signature.dto";
import { JwtAuthGuard } from "../../../../modules/auth/guards";
import { RoleGuard } from "../../../../core/guards/role.guard";
import { ZoomService } from "../services/zoom.service";
import { CreateMeetingDto } from "../dtos/create-meeting.dto";
import { GenerateTokenDto } from "../dtos/generate-token.dto";

@Controller(Endpoint.ZOOM)
export class ZoomController {
    constructor(private zoomService: ZoomService) {}

    @Post("webhook")
    webhook(@Req() req: Request, @Res() res: Response): void {
        this.zoomService.webhook(req, res);
    }

    @Get("webhook")
    webhookGet(@Req() req: Request, @Res() res: Response): void {
        this.zoomService.webhookGet(req, res);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR)
    @Post("generate-token")
    generateToken(@Body() generateTokenDto: GenerateTokenDto): Promise<boolean> {
        return this.zoomService.generateToken(generateTokenDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR)
    @Post("refresh-token")
    refreshToken(): Promise<boolean> {
        return this.zoomService.refreshToken();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR)
    @Post("user")
    user(): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.zoomService.getZoomUser();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR)
    @Post("create-meeting")
    createMeeting(@Body() createMeetingDto: CreateMeetingDto): any {
        return this.zoomService.createMeeting(createMeetingDto.topic);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR)
    @Get("meeting/:id")
    getMeeting(@Param("id", ParseIntPipe) id?: number): any {
        return this.zoomService.getMeeting(id);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR)
    @Get("meeting")
    getMeetings(): any {
        return this.zoomService.getMeeting();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR)
    @Post("get-zak-token")
    getZakToken(): any {
        return this.zoomService.getZakToken();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post("generate-signature")
    generateSignature(@Body() generateSignatureDto: GenerateSignatureDto): { signature: string } {
        return this.zoomService.generateSignature(generateSignatureDto.meetingNumber, generateSignatureDto.role);
    }
}
