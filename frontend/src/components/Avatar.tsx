import Image from 'next/image';

export default function Avatar({
    name,
    picture,
    size,
}: {
    name: string | null | undefined
    picture: string | null | undefined
    size: number
}) {
    return (
        <div className="border-1 h-6 w-6 overflow-hidden rounded-full border-gray-900 dark:border-white">
            <div>
                {picture ? (
                    <Image
                        src={picture}
                        alt=""
                        width={size}
                        height={size}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-500">
            <span className="text-lg font-medium leading-none text-white">
              {name
                  ?.split(' ')
                  .map((value) => value[0])
                  .join('')
                  .toUpperCase()}
            </span>
          </span>
                )}
            </div>
        </div>
    );
}
