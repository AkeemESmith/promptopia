
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
    match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"]
  },
  image: {
    type: String,
  }
});

const User = models.User || model("User", UserSchema);

export default User;

// .env

// GOOGLE_ID=655816020686-v2re01r3ihvbdotrl9jmp6ubg0hu6in4.apps.googleusercontent.com
// GOOGLE_CLIENT_SECRET=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

// MONGODB_URI = mongodb+srv://akeemesmith:36913@assessment.lu38spc.mongodb.net/?retryWrites=true&w=majority

// NEXTAUTH_URL = http://localhost:3000
// NEXTAUTH_URL_INTERNAL = http:localhost:3000
// NEXTAUTH_SECRET = BdsiDQ0WPzLF369rncaimczw/6D3kqS3dNisFbSDpNA=

// // database.js

// import mongoose from 'mongoose';

// let isConnected = false; // track the connection

// export const connectToDB = async () => {
//   mongoose.set('strictQuery', true);

//   if(isConnected) {
//     console.log('MongoDB is already connected');
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "share_prompt",
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })

//     isConnected = true;

//     console.log('MongoDB connected')
//   } catch (error) {
//     console.log(error);
//   }
// }

// //route.js 

// import NextAuth from "next-auth";
// import GoogleProvider from 'next-auth/providers/google';
// import User from '@models/user';

// import { connectToDB } from "@utils/database";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     })
//   ],

//   callbacks: {
//     async session({ session }) {
//       const sessionUser = await User.findOne({ email: session.user.email })
//       session.user.id = sessionUser._id.toString();

//       return session;
//     },
//     async signIn({ account, profile, user, credentials }) {
//       try {  //serverless -> Lambda -> dynamoDB
//         await connectToDB();

//         //check if user already exists
//         const userExists = await User.findOne({ email: profile.email });

//         //if not, create a new user
//         if (!userExists) {
//           await User.create({
//             email: profile.email,
//             username: profile.name.replace(" ", "").toLowerCase(),
//             image: profile.picture,
//           });
//         }
//         return true;
//       } catch (error) {
//         console.log("Error checking if user exists: ", error.message);
//         return false;
//       }
//     },
//   }
// });

// export { handler as GET, handler as POST }

// //nav.jsx

// "use client";

// import Link from 'next/link';
// import Image from 'next/image';
// import { useState, useEffect } from 'react';
// import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

// const Nav = () => {
//   const { data: session } = useSession();

//   const [providers, setProviders ] = useState(null);
//   const [toggleDropdown, setToggleDropdown] = useState(false);

//   useEffect(() => {
//     const setUpProviders = async () => {
//       const response = await getProviders();

//       setProviders(response);
//     }

//     setUpProviders();
//   }, [])

//   return (
//     <nav className="flex-between w-full mb-16 pt-3">
//       <Link href="/" className="flex gap-2 flex-center">
//         <Image 
//           src="/assets/images/logo.svg"
//           alt="Promptopia Logo"
//           width={30}
//           height={30}
//           className="object-contain"
//         />
//         <p className="logo_text">Promptopia</p>
//       </Link>

//       {/* Desktop Navigation */}
//       <div className="sm:flex hidden">
//         {session?.user ? (
//           <div className="flex gap-3 md:gap-5">
//             <Link href="/create-prompt" className="black_btn">
//               Create Post
//             </Link>

//             <button type="button" onClick={signOut} className="outline_btn">
//               Sign Out
//             </button>

//             <Link href="/profile">
//               <Image 
//                 src={session?.user.image}
//                 width={37}
//                 height={37}
//                 className="rounded-full"
//                 alt="profile"
//               />
//             </Link>
//           </div>
//         ): (
//           <>
//             {providers && 
//               Object.values(providers).map((provider) => (
//                 <button
//                   type="button"
//                   key={provider.name}
//                   onClick={() => signIn(provider.id)}
//                   className='black_btn'
//                 >
//                   Sign In
//                 </button>
//               ))}
//           </>
//         )}
//       </div>

//       {/* Mobile Navigation */}
//       <div className="sm:hidden flex relative">
//         {session?.user ? (
//           <div className="flex">
//             <Image 
//               src={session?.user.image}
//               width={37}
//               height={37}
//               className="rounded-full"
//               alt="profile"
//               onClick={() => setToggleDropdown((prev) => !prev)}
//             />

//             {toggleDropdown && (
//               <div className="dropdown">
//                 <Link
//                   href="/profile"
//                   className="dropdown_link"
//                   onClick={() => setToggleDropdown(false)}
//                 >
//                   My Profile
//                 </Link>
//                 <Link
//                   href="/create-prompt"
//                   className="dropdown_link"
//                   onClick={() => setToggleDropdown(false)}
//                 >
//                   Create Prompt
//                 </Link>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setToggleDropdown(false);
//                     signOut();
//                   }}
//                   className="mt-5 w-full black_btn"
//                 >
//                   Sign Out
//                 </button>
//               </div>
//             )}
//           </div>
//         ): (
//           <>
//             {providers && 
//               Object.values(providers).map((provider) => (
//                 <button
//                   type="button"
//                   key={provider.name}
//                   onClick={() => signIn(provider.id)}
//                   className='black_btn'
//                 >
//                   Sign In
//                 </button>
//               ))}
//           </>
//         )}
//       </div>
      
//     </nav>
//   )
// }

// export default Nav