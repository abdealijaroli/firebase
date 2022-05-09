import { useEffect, useState, useCallback, useContext } from 'react';
import { auth, firestore, googleAuthProvider, popUp, db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { UserContext } from '../lib/context';
// import Metatags from '@components/Metatags';
import debounce from 'lodash.debounce';

export default function Enter() {
   const { user } = useContext(UserContext);
   const [userData, setUserData] = useState([]);

   useEffect(() => {
      const getUserData = async () => {
         const res = await getDocs(collection(db, "users"));
         setUserData(res.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
      getUserData();
      console.log(userData)
   }, [])

   
   return (
      <main>
         <h1> 
         </h1>
         {user ?
            <SignOutButton />
            :
            <SignInButton />
         }
      </main>
   );
}

function SignInButton() {
   const signInWithGoogle = async () => {
      await popUp(auth, googleAuthProvider);
   }

   return (
      <button className="btn-google" onClick={signInWithGoogle}>
         Sign in with Google
      </button>
   )
}


function SignOutButton() {
   return <button onClick={() => auth.signOut()}>Sign Out</button>
}

// // Username form
// function UsernameForm() {
//    const [formValue, setFormValue] = useState('');
//    const [isValid, setIsValid] = useState(false);
//    const [loading, setLoading] = useState(false);

//    const { user, username } = useContext(UserContext);

//    const onSubmit = async (e) => {
//       e.preventDefault();

//       // Create refs for both documents
//       const userDoc = getDoc(collection(db, `users/${user.uid}`));
//       const usernameDoc = getDoc(collection(db, `usernames/${formValue}`));

//       console.log(userDoc);
//       console.log(usernameDoc);

//       // Commit both docs together as a batch write.
//       const batch = firestore.batch();
//       batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
//       batch.set(usernameDoc, { uid: user.uid });

//       await batch.commit();
//    };

//    const onChange = (e) => {
//       // Force form value typed in form to match correct format
//       const val = e.target.value.toLowerCase();
//       const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

//       // Only set form value if length is < 3 OR it passes regex
//       if (val.length < 3) {
//          setFormValue(val);
//          setLoading(false);
//          setIsValid(false);
//       }

//       if (re.test(val)) {
//          setFormValue(val);
//          setLoading(true);
//          setIsValid(false);
//       }
//    };

//    //

//    useEffect(() => {
//       checkUsername(formValue);
//    }, [formValue]);

//    // Hit the database for username match after each debounced change
//    // useCallback is required for debounce to work
//    const checkUsername = useCallback(
//       debounce(async (username) => {
//          if (username.length >= 3) {
//             const ref = doc(db, `username/${username}`);
//             const { exists } = await getDoc(ref);
//             console.log('Firestore read executed!');
//             setIsValid(!exists);
//             setLoading(false);
//          }
//       }, 500),
//       []
//    );

//    return (
//       !username && (
//          <section>
//             <h3>Choose Username</h3>
//             <form onSubmit={onSubmit}>
//                <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
//                <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
//                <button type="submit" className="btn-green" disabled={!isValid}>
//                   Choose
//                </button>

//                <h3>Debug State</h3>
//                <div>
//                   Username: {formValue}
//                   <br />
//                   Loading: {loading.toString()}
//                   <br />
//                   Username Valid: {isValid.toString()}
//                </div>
//             </form>
//          </section>
//       )
//    );
// }

// function UsernameMessage({ username, isValid, loading }) {
//    if (loading) {
//       return <p>Checking...</p>;
//    } else if (isValid) {
//       return <p className="text-success">{username} is available!</p>;
//    } else if (username && !isValid) {
//       return <p className="text-danger">That username is taken!</p>;
//    } else {
//       return <p></p>;
//    }
// }