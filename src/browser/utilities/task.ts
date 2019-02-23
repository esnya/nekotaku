export default async function run(task: () => Promise<void>): Promise<void> {
  try {
    await task();
  } catch (e) {
    console.error(e);
  }
}
