beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterAll(() => {
    jest.restoreAllMocks();
});
