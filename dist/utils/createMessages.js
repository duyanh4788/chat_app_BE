"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatusOffline = exports.changeStatusOnline = exports.renderMessages = void 0;
const renderMessages = ({ conversationId, senderId, reciverId, text, }) => {
    if (text && text !== null) {
        const data = {
            conversationId,
            senderId,
            reciverId,
            text,
        };
        return data;
    }
};
exports.renderMessages = renderMessages;
const changeStatusOnline = (user) => {
    const data = {
        account: user.account,
        avatar: user.avatar,
        email: user.email,
        fullName: user.fullName,
        isOnline: true,
        _id: user._id,
    };
    return data;
};
exports.changeStatusOnline = changeStatusOnline;
const changeStatusOffline = (user) => {
    const data = {
        account: user.account,
        avatar: user.avatar,
        email: user.email,
        fullName: user.fullName,
        isOnline: false,
        _id: user._id,
    };
    return data;
};
exports.changeStatusOffline = changeStatusOffline;
//# sourceMappingURL=createMessages.js.map