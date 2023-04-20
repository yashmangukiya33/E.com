import {Request, Response} from "express";
import {ThrowError} from "../util/ErrorUtil";
import UserCollection from "../schemas/UserSchema";
import {APP_CONSTANTS} from "../contants";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {IUser} from "../models/IUser";
import mongoose from "mongoose";
import * as UserUtil from "../util/UserUtil";


/**
 * @usage : Register a User
 * @url : http://localhost:9000/api/users/register
 * @params : username , email , password
 * @method : POST
 * @access : PUBLIC
 */
export const registerUser = async (request: Request, response: Response) => {
    try {
        let {username, email, password} = request.body;
        // check if the user exists
        let userObj = await UserCollection.findOne({email: email});
        if (userObj) {
            return response.status(401).json({
                msg: 'User Already exists',
                data: null,
                status: APP_CONSTANTS.FAILED
            })
        }

        // get the gravatar url
        let imageUrl: string = gravatar.url(email, {
            size: '200',
            rating: 'pg',
            default: 'mm'
        })

        // hash password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // create a user
        let newUser: IUser = {
            username: username,
            email: email,
            password: hashPassword,
            imageUrl: imageUrl
        };
        let user = await new UserCollection(newUser).save();
        if (user) {
            return response.status(201).json({
                msg: 'Registration is Success'
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Login a User
 * @url : http://localhost:9000/api/users/login
 * @params : email , password
 * @method : POST
 * @access : PUBLIC
 */
export const loginUser = async (request: Request, response: Response) => {
    try {
        let {email, password} = request.body;

        // verify email , password
        let userObj = await UserCollection.findOne({email: email});
        if (!userObj) {
            return response.status(401).json({
                msg: 'Invalid Credentials Email',
                data: null,
                status: APP_CONSTANTS.FAILED
            })
        }
        let isMatch: boolean = await bcryptjs.compare(password, userObj.password);
        if (!isMatch) {
            return response.status(401).json({
                msg: 'Invalid Credentials Password',
                data: null,
                status: APP_CONSTANTS.FAILED
            })
        }
        // create token & send
        let payload = {
            id: userObj._id,
            email: userObj.email
        };
        let secretKey: string | undefined = process.env.EXPRESS_APP_JWT_SECRET_KEY;
        if (payload && secretKey) {
            let token = jwt.sign(payload, secretKey, {
                expiresIn: 1000000
            });
            return response.status(200).json({
                msg: 'Login is Success',
                token: token,
                user: userObj
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 *  @usage : get users Data
 *  @url : http://localhost:9000/api/users/me
 *  @method : GET
 *  @access : PRIVATE
 * @param request
 * @param response
 */
export const getUsersData = async (request: Request, response: Response) => {
    try {
        // check if the user exists
        const theUser = await UserUtil.getUser(request, response);
        if (theUser) {
            response.status(200).json({
                data: theUser,
                status: APP_CONSTANTS.SUCCESS,
                msg: ""
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : update profile Picture
 * @url : http://localhost:9000/api/users/profile
 * @params : imageUrl
 * @method : POST
 * @access : PRIVATE
 */
export const updateProfilePicture = async (request: Request, response: Response) => {
    try {
        const {imageUrl} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            theUser.imageUrl = imageUrl;
            const userObj = await theUser.save();
            if (userObj) {
                response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    msg: "Profile picture is updated",
                    data: userObj
                });
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : change the password
 * @url : http://localhost:9000/api/users/change-password
 * @params : password
 * @method : POST
 * @access : PRIVATE
 */
export const changePassword = async (request: Request, response: Response) => {
    try {
        const {password} = request.body;
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            theUser.password = hashPassword;
            const userObj = await theUser.save();
            if (userObj) {
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    msg: "Password is changed!",
                    data: userObj
                });
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};
