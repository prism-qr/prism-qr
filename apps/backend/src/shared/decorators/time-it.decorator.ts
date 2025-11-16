import { Logger } from '@nestjs/common';

export function TimeIt() {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const logger = new Logger(target.constructor.name);

    const wrappedMethod = async function (
      ...args: unknown[]
    ): Promise<unknown> {
      const startTime = Date.now();

      try {
        const result = await originalMethod.apply(this, args);
        const endTime = Date.now();
        logger.log(`${propertyKey} execution time: ${endTime - startTime}ms`);
        return result;
      } catch (error) {
        const endTime = Date.now();
        logger.log(
          `${propertyKey} execution time (failed): ${endTime - startTime}ms`,
        );
        throw error;
      }
    };

    Reflect.getMetadataKeys(originalMethod).forEach((key) => {
      const metadata = Reflect.getMetadata(key, originalMethod);
      Reflect.defineMetadata(key, metadata, wrappedMethod);
    });

    descriptor.value = wrappedMethod;

    return descriptor;
  };
}
