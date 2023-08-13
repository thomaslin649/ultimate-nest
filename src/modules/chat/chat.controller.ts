import { Get } from '@nestjs/common'
import { ChatService } from './chat.service'
import { GenericController, LoggedInUser } from '@common/decorators'
import { User } from '@entities'

@GenericController('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getConversationForUser(@LoggedInUser() user: User) {
    return this.chatService.getConversationForUser(user)
  }
}
