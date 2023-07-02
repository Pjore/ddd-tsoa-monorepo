import { ResultOrError, ILocals } from "@pjore/common/types";
import { Expose, plainToInstance } from "class-transformer";
import { IsString, MaxLength, MinLength, validateSync } from "class-validator";

export interface ISignInResult extends ILocals {
    token: string;
}
export class SignInDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    @Expose()
    email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(200)
    @Expose()
    password: string;

    static transform(obj: any): ResultOrError<SignInDTO, any> {
        if (!obj) {
            return ResultOrError.fail('Empty object');
        }

        const objAsClass = plainToInstance(SignInDTO, obj, { excludeExtraneousValues: true });
        const validationErrors = validateSync(objAsClass);
        if (validationErrors?.length > 0) {
            return ResultOrError.fail(validationErrors);
        }

        return ResultOrError.ok(objAsClass);
    }
}

