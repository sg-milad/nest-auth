import { IsEnum, IsNumber } from "class-validator";
import { Role } from "src/constants/role.enum";

export class AddNewRoleDto {
    @IsEnum(Role)
    newRole:Role [];
 
    @IsNumber()
    userId:number
}