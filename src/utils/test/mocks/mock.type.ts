export interface LumMock<T> {
    mocked: T,

    reset: () => void, // Reset the mocks of T
    restore: () => void // Restore all mocks of T to their original setup.
}
