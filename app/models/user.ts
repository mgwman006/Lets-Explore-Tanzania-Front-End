 export interface User {
    firstName : string;
    lastName : string;
    email : string;
    passWord: string;
};

export interface LogInDetails {
    email: string;
    passWord: string
}


export enum UserStatus {
    LogInSuccess = "LogInSuccess",
}

export interface LandLord
{
    firstName : string;
    lastName : string;
    phoneNumber : string;
    email : string;
    passWord: string;
}

export interface Tenant
{
    firstName : string;
    lastName : string;
    phoneNumber : string;
    email : string;
}

export interface TenantResponseDto
{
    id: number;
    firstName : string;
    lastName : string;
    phoneNumber : string;
    email : string;
}

export interface LandLordResponseDto
{
    id: number;
    firstName : string;
    lastName : string;
    phoneNumber : string;
    email : string;
}