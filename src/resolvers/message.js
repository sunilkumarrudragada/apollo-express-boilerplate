import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';

export default {
  Query: {
    message: (parent, { id }, { models}) => {
      return models.Message.findByPk(id); 
    },

    messages: (parent, { limit = 10, offset = 0 }, { models }) => {
      return models.Message.findAll({ limit, offset }); 
    }
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      (parent, { text }, { me, models }) => {
        return models.Message.create({
          text,
          userId: me.id
        });
      }
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner, 
      (parent, { id }, { models }) => {
          return models.Message.destroy({ where: { id }
        });
      }
    ),
  },

  Message: {
    user: (message, args, { models }) => {
      return models.User.findByPk(message.userId); 
    },
  },
};