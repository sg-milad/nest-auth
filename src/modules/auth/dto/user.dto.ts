import { IsInt, IsString, Length, Max, Min } from "class-validator";
import { Role } from "src/constants/role.enum";

export class UserDto {
  @IsString()
  @Length(3)
  readonly username: string;
 
  @IsInt()
  @Min(5)
  readonly password: string;
  
  roles:Role [];
}
