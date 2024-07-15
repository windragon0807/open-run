import { UserRegister } from '@models/register'
import { ApiResponse } from '@apis/axios'

export type RequestType = UserRegister

export type ResponseType = ApiResponse<{}>
