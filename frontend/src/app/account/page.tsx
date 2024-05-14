'use client';
import Avatar from '@/components/Avatar';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function AccountPage() {
    const { user, error, isLoading } = useUser();
    console.log(user);
    return (
        <main>
            <h1 className="sr-only">Account Settings</h1>

            {/* Settings forms */}
            <div className="mx-auto max-w-4xl divide-y divide-white/5 py-6">
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-white">
                            Account Information
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-400">
                            Your account information.
                        </p>
                    </div>

                    <form className="md:col-span-2">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                            <div className="col-span-full flex items-center gap-x-8">
                                <Avatar
                                    name={user?.name}
                                    picture={user?.picture}
                                    size={100}
                                />
                                <div>
                                    <button
                                        type="button"
                                        className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                                    >
                                        Change avatar
                                    </button>
                                    <p className="mt-2 text-xs leading-5 text-gray-400">
                                        JPG, GIF or PNG. 1MB max.
                                    </p>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="first-name"
                                    className="block text-sm font-medium leading-6 text-white"
                                >
                                    Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        value={user?.name ? user?.name : ''}
                                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium leading-6 text-white"
                                >
                                    Username
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                    <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm">
                      evan.org/
                    </span>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            autoComplete="username"
                                            className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                                            placeholder={user?.nickname ? user?.nickname : ''}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex">
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
