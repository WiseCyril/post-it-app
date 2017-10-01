import * as firebase from 'firebase';
import express from 'express';
import config from '../../../server/database';

const apiRouter = express.Router();
firebase.initializeApp(config);


/**
 * Route for signing up  a user.
 * @param {object} req; request 
 * @param {object} res; response
 *
 * @returns {promise} signed user
 */

apiRouter.route('/user/signup')
  // create a user
  .post((req, res) => {
    const { displayName, email, password } = req.body;
    const time = new Date().toString();
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      firebase.auth().currentUser.updateProfile({
        displayName,
      });
    })
      .then(() => {
        firebase.database().ref('user').push({
          displayName,
          email,
          time,
        });
      })
      .then(() => res.status(200).json({ message: 'signup sucessful' }))
      .catch((error) => {
        const errorCode = error.code;
        return res.status(401).json({ message: 'Somthing went wrong', errorCode });
      });
  });

/**
 * Sign in users.
 * @param {object} req; 
 * @param {object} res;
 *
 * @returns {object} user token
 */
apiRouter.route('/user/signin')
  .post((req, res) => {
    const { email, password } = req.body;
    firebase.auth().signInWithEmailAndPassword(email, password).then(
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken().then(token => res.status(200).json({
            message: 'Sign In Successful', token }));
        }
      }),
    ).catch((error) => {
      const errorCode = error.code;
      return res.status(401).json({ message: 'Somthing went wrong', errorCode });
    });
  });
/**
 * Signout Route.
 * @param {string} email; 
 *
 * @returns {Promise}
 */
apiRouter.route('/signout')
  .get((req, res) => {
    firebase.auth().signOut()
      .then(() => res.status(200).json({ message: 'signed-out successfully.' }))
      .catch(() => res.status(404).json({ message: 'Network Error' }));
  });

/**
 * Route to reset user password.
 * @param {string} email; 
 *
 * @returns {Promise}
 */
apiRouter.route('/user/passwordreset')
  .post((req, res) => {
    const auth = firebase.auth();
    const emailAddress = req.body.email;
    auth.sendPasswordResetEmail(emailAddress)
      .then(() => res.status(200).json({
        message: `Password Reset Mail Sent to${emailAddress}` }))
      .catch((error) => {
        const errorCode = error.message;
        return res.status(401).json({ errorCode });
      });
  });

/**
 * Route to create user groups.
 * @param {string} groupname; 
 * @param {string} discription; 
 * @returns {Object} 
 */
apiRouter.route('/groups')
  .post((req, res) => {
    const { groupname, discription } = req.body;
    const dateCreated = new Date().toString();
    const currentUser = firebase.auth().currentUser;
    const userEmail = currentUser.email;
    const createdBy = currentUser.uid;
    const displayName = currentUser.displayName;
    if (currentUser !== null) {
      firebase.database().ref('group/').push({
        groupname,
        dateCreated,
        GroupAdmin: userEmail,
        createdBy,
        displayName,
        Discription: discription,
      }).then(() => res.status(201).json({ message: 'group created Sucessfuly',
      }))
        .catch((error) => {
          const errorCode = error.code;
          return res.status(401).json({ message: 'Somthing went wrong', errorCode });
        });
    }
  });
apiRouter.route('/groups/group')
  .get((req, res) => {
    const user = firebase.auth().currentUser;
    if (user) {
      const groups = [];
      firebase.database().ref('/group')
        .orderByKey().once('value', (snapshot) => {
          snapshot.forEach((child) => {
            const group = {
              groupid: child.key,
              groupname: child.val().groupname,
              Discription: child.val().Discription,
              GroupAdmin: child.val().GroupAdmin,
            };
            groups.push(group);
          });
        })
        .then(() => res.json(
          { groups },
        ))
        .catch(error => res.status(500).json({
          message: `Error occurred ${error.message}`,
        }));
    } else {
      return res.status(403).json({
        message: 'You are not signed in right now!',
      });
    }
  });

/**
 * Route for adding members to group.
 * @param {string} groupname; 
 * @param {string} groupmember; 
 * 
 */
apiRouter.route('/group/addmember')
  .post((req, res) => {
    const { groupName, displayName, groupId } = req.body;
    const users = [];
    const groups = [];
    const groupMember = [];
    const registeredUsers = firebase.database().ref('user').orderByKey();
    const createdGroups = firebase.database().ref('group').orderByValue();
    const groupMembers = firebase.database().ref(`group/${groupId}/members`).orderByKey();
    registeredUsers.once('value', (snapshot) => {
      snapshot.forEach((childSnapShot) => {
        const user = childSnapShot.val().displayName;
        users.push(user);
      });
    });
    groupMembers.once('value', (snapshot) => {
      snapshot.forEach((childSnapShot) => {
        const groupmember = childSnapShot.val().displayname;
        groupMember.push(groupmember);
      });
    });
    createdGroups.once('value', (snapshot) => {
      snapshot.forEach((childSnapShot) => {
        const group = childSnapShot.val().groupname;
        groups.push(group);
      });
      const group = groups.includes(`${groupName}`);
      const user = users.includes(`${displayName}`);
      const member = groupMember.includes(`${displayName}`);
      if (!user) {
        return res.status(400).json({ message: 'user not found' });
      }
      if (!group) {
        return res.status(400).json({ message: 'Group not found' });
      }
      if (member) {
        return res.status(400).json({ message: 'This user is alredy a member of this group' });
      }
      firebase.database().ref(`group/${groupId}/`).child('members').push({
        displayName,

      });
    }).then(() => res.status(200).json({ message: 'user added sucessfully' }))
      .catch((error) => {
        const errorCode = error.code;
        return res.status(400).json({ message: 'Somthing went wrong', errorCode });
      });
  });


module.exports = apiRouter;