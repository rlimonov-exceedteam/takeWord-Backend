const UserSchema = require('.././db/models/user-schema');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const ApiError = require('../exceptions/api-error');
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration(login, password) {
        const candidate = await UserModel.findOne({ login });

        if (candidate) {
            throw ApiError.BadRequest(`User with login ${login} already exists.`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({login, password: hashPassword});
        
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
        return {...tokens, user: userDto}
    }   
}

module.exports = new UserService();