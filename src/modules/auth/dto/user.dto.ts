import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsInt, IsString, Length, Max, Min } from "class-validator";
import { Role } from "src/constants/role.enum";

export class UserDto {
  @IsString()
  @Length(3)
  @ApiProperty()
  readonly username: string;
 

  @ApiProperty()
  readonly password: string;

  roles:Role [];
}
