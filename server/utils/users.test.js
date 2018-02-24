const expect = require('expect');

const { Users } = require('./users')

describe('Users', () => {

  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Jake',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Thomas',
      room: 'React Course'
    }, {
      id: '3',
      name: 'Alphie',
      room: 'Node Course'
    }];
  });

  it('should add a new user' , () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'Jake',
      room: 'Jake\'s room'
    };
    const resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should return names for Node Course', () => {
    const userList = users.getUserList('Node Course');

    expect(userList).toEqual(['Jake', 'Alphie']);
  });

  it('should return names for React Course', () => {
    const userList = users.getUserList('React Course');

    expect(userList).toEqual(['Thomas']);
  });

  it('should remove a user', () => {
    const oldUser = users.users[2];
    const user = users.removeUser('3');

    expect(user).toEqual(oldUser);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user if id is invalid', () => {
    const user = users.removeUser('99');

    expect(user).toBe(undefined);
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const user = users.getUser(2);

    expect(user).toEqual(users[1]);
  });

  it('should not find user if id is invalid', () => {
    const user = users.getUser(99);
    const user2 = users.getUser('sesf');

    expect(user).toEqual(undefined);
    expect(user2).toEqual(undefined);
  });
});
