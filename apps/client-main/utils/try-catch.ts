import { Ok, type Result, Err } from 'ts-res'

export const tryCatch = async <T>(
  promise: Promise<T>
): Promise<Result<T, Error>> => {
  try {
    const result = await promise
    return Ok(result)
  } catch (error) {
    return Err(error as Error)
  }
}
