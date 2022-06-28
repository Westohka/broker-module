type MethodDecorator = <T>(
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void;

const Subscribe =
  (queue: string): MethodDecorator =>
  (...args) => {
    const [proto, propName, descriptor] = args;
    Reflect.defineMetadata('QUEUE_METADATA', queue, descriptor.value);

    return descriptor;
  };

export default Subscribe;
