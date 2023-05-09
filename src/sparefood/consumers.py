import json

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from .jwt_decoder import decode_jwt, is_admin

from .models import User, ChatRoom, Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self) -> None:
        """Sets up an init value for chat room on daphne connection and connects the user to that websocket"""
        self.ChatRoom = self.scope['url_route']['kwargs']['ChatRoom']
        self.ChatRoom_name = 'chat_%s' % self.ChatRoom

        await self.channel_layer.group_add(
            self.ChatRoom_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, args, **kwargs) -> None:
        """Handles a user disconnect
        :param args: Any additional delegations that need to be done when a socket is ended
        """
        await self.channel_layer.group_discard(
            self.ChatRoom_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None) -> None:
        """Listens for an incoming message and then processes it to the database
        :param text_data: The JSON of the incoming message to be handled
        :param bytes_data: A bytes object of any other data needing processing
        """
        data = json.loads(text_data)
        message = data['message']
        if message == '':
            return
        user_id = decode_jwt(data['jwt'], True)
        if user_id == '0':
            return
        if is_admin(data['jwt'], True):
            return
        room = data['ChatRoom']

        await self.save_message(user_id, room, message)

        await self.channel_layer.group_send(
            self.ChatRoom_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_id': user_id,
                'room': room
            }
        )

    async def chat_message(self, event) -> None:
        """Consumer for a handle event of messaging which will send back a response once the message has been
        processed to the websocket server
        :param event: Firing stage for a websocket
        """
        message = event['message']
        username = await self.get_username(event['user_id'])

        await self.send(text_data=json.dumps({
            'username': username,
            'message': message,
        }))

    @sync_to_async
    def save_message(self, user_id, room, message) -> None:
        """Saves a message to the database
        :param user_id: uuid object of the user requested
        :param room: uuid object of the room the message was sent to
        :param message: string of the message sent by the user
        """
        user = User.objects.get(id=user_id)
        chatroom = ChatRoom.objects.get(id=room)
        Message.objects.create(user=user, chat_room=chatroom, value=message)

    @sync_to_async
    def get_username(self, user_id) -> str:
        """Queries the database for a user set name
        :return: The full name of the requested user
        """
        return (User.objects.get(id=user_id)).full_name
