export enum CHECK_POLICIES_KEY {
  HANDLER = 'CHECK_POLICIES_HANDLER',
  CAN = 'CHECK_POLICIES_CAN',
  CANNOT = 'CHECK_POLICIES_CANNOT',
}

// GUARDS -> routes meta -> @CheckPolicies @Can @Cannot
// @CheckPolicies -> (handler) -> ability => boolean
// @Can -> (Action, Subject, Condition)
// @Cannot -> (Action, Subject, Condition)
