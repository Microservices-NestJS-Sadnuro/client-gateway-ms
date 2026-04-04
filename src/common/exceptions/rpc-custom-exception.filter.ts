import { ArgumentsHost, Catch, ParseIntPipe, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Catch(RpcException)
export class RpcCustomExceptionFilter implements RpcExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const rpcError = exception.getError();

        if (typeof rpcError === 'object'
            && 'status' in rpcError
            && 'message' in rpcError
        ) {
            const status = isNaN(rpcError.status as number) ? 400 : rpcError.status;
            return response.status(status).json(rpcError);
        }

        return response.status(400).json({
            status: 400,
            message: rpcError
        })
    }
}