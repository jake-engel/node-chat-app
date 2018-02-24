const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'TestScript';
    const text = 'New message test';
    const message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({ from, text });
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = "Me";
    const lat = 36;
    const lng = -17;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    const message = generateLocationMessage(from, lat, lng);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({ from, url });
  });
});
