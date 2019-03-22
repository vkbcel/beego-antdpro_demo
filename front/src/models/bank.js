import { banks, createBank, deleteBank, updateBank, getBank } from '@/services/bank';

export default {
  namespace: 'bank',

  state: {
    list: [],
    bank: {},
  },

  effects: {
    *fetchBanks(_, { call, put }) {
      const response = yield call(banks);
      yield put({
        type: 'saveBanks',
        payload: response,
      });
    },
    *fetchCreateBank({ payload }, { call, put }) {
      const response = yield call(createBank, payload);
    },
    *fetchDeleteBank({ payload }, { call, put }) {
      console.log("----" + payload);
      const response = yield call(deleteBank, payload.id);
    },
    *fetchUpdateBank({ payload }, { call, put }) {
      const response = yield call(updateBank, payload.id, payload);
    },
    *fetchGetBank({ payload }, { call, put }) {
      const response = yield call(getBank, payload.id);
      yield put({
        type: 'saveBank',
        payload: response,
      });
    },
  },

  reducers: {
    saveBanks(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveBank() {
      return {
        ...state,
        bank: action.payload,
      };
    },
  },
};
