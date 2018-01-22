import { doNavigate, selectPathAfterAuth } from 'lbry-redux';
import { connect } from 'react-redux';
import {
  selectAuthenticationIsPending,
  selectEmailToVerify,
  selectUserIsVerificationCandidate,
  selectUser,
  selectUserIsPending,
  selectIdentityVerifyIsPending,
} from 'redux/selectors/user';
// eslint-disable-next-line import/no-named-as-default
import AuthPage from './view';

const select = state => ({
  isPending:
    selectAuthenticationIsPending(state) ||
    selectUserIsPending(state) ||
    selectIdentityVerifyIsPending(state),
  email: selectEmailToVerify(state),
  pathAfterAuth: selectPathAfterAuth(state),
  user: selectUser(state),
  isVerificationCandidate: selectUserIsVerificationCandidate(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(AuthPage);
