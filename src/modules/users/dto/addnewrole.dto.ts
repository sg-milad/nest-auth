import { IsEnum, IsNumber } from "class-validator";
import { Role } from "../../../constants/role.enum";

export class AddNewRoleDto {
    @IsEnum(Role)
    newRole:Role [];
 
    @IsNumber()
    userId:number
}