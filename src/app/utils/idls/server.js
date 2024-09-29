export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    setAccounts: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [IDL.Text],
      []
    ),
    validateAccounts: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], ["query"]),
    validateDocId: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    validatePubKey: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
  });
};
