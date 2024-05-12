import { ApiResponse } from '@apis/axios'
import { UserRegister } from '@models/register'

export type RequestType = UserRegister

export type ResponseType = ApiResponse<{}>
