import { Hostname } from '@marketplace-web/vinted-context/construct-headers-util'

// All of the groups will always exist on
// `OptanonConsent` cookie. If the group is
// enabled or not is defined by the binary
// value after the `:`.
//
// For example, `C0001:1` means that
// stricly necessary cookies group is
// enabled and respectively `C0001:0`
// means that it is disabled
//
// Therefore, we don't need to work with
// values to check if `C0001:0` exists.
// Getting a result that `C0001:1` does
// not exist would have the same outcome.

export enum ConsentGroup {
  // These cookies are necessary for the website to function and cannot be switched off in our
  // systems. They are usually only set in response to actions made by you which amount to a
  // request for services, such as setting your privacy preferences, logging in or filling in forms.
  // You can set your browser to block or alert you about these cookies, but some parts of the site
  // will not then work. These cookies do not store any personally identifiable information.
  StrictlyNecessary = 'C0001:1',
  // These cookies allow us to count visits and traffic sources so we can measure and improve the
  // performance of our site. They help us to know which pages are the most and least popular and
  // see how visitors move around the site. All information these cookies collect is aggregated and
  // therefore anonymous. If you do not allow these cookies we will not know when you have visited
  // our site, and will not be able to monitor its performance.
  Performance = 'C0002:1',
  // These cookies enable the website to provide enhanced functionality and personalisation. They
  // may be set by us or by third party providers whose services we have added to our pages. If you
  // do not allow these cookies then some or all of these services may not function properly.
  Functional = 'C0003:1',
  // These cookies may be set through our site by our advertising partners. They may be used by
  // those companies to build a profile of your interests and show you relevant adverts on other
  // sites. They do not store directly personal information, but are based on uniquely identifying
  // your browser and internet device. If you do not allow these cookies, you will experience less
  // targeted advertising.
  Targeting = 'C0004:1',
  // These cookies are set by a range of social media services that we have added to the site to
  // enable you to share our content with your friends and networks. They are capable of tracking
  // your browser across other sites and building up a profile of your interests. This may impact
  // the content and messages you see on other websites you visit. If you do not allow these cookies
  // you may not be able to use or see these sharing tools.
  SocialMedia = 'C0005:1',
  // This targeting may be set through our site by Amazon Advertising. This company may use it to build
  // a profile of your interests and show you relevant adverts on other sites. Direct personal information
  // is not being used, but targeting could be based on uniquely identifying your browser and internet
  // device and the hashed email address. If you do not allow this targeting, you will experience less
  // targeted advertising.
  AmazonAdvertising = 'C0015:1',
  // These cookies may be set through our site by our advertising partners. They may be used by those
  // companies to personalise advertisements for our users.
  PersonalisedAds = 'V2STACK42:1',
  // Non-IAB vendors are vendors who haven't registered with IAB Europe and are not participating
  // in the TCF and not following TCF policies.
  NonIAB = 'M0001:1',
  // Allowing third-party ad tracking and third-party ad serving through Google and other
  // vendors to occur.
  Google = 'gad:1',
  // Allowing Rokt Advertising ads to be shown
  RoktAdvertising = 'C0035:1',
  // Allowing targeted VAN Advertising ads to be shown
  VanAdvertising = 'C0038:1',
}

export const consentKeyByHostname: Record<(typeof Hostname)[keyof typeof Hostname], string> = {
  [Hostname.At]: '7cee258e-a707-4de7-bcfd-23a314589dec',
  [Hostname.AtSandbox]: '7cee258e-a707-4de7-bcfd-23a314589dec-test',
  [Hostname.Be]: '330b7cd6-c85d-481b-9d45-c373b76dfba6',
  [Hostname.BeSandbox]: '330b7cd6-c85d-481b-9d45-c373b76dfba6-test',
  [Hostname.Cz]: '504deae3-0dd0-4d2d-97bb-a1281a3ef754',
  [Hostname.CzSandbox]: '504deae3-0dd0-4d2d-97bb-a1281a3ef754-test',
  [Hostname.De]: '77cefc92-e89f-48f9-8ae1-23dcee412e05',
  [Hostname.DeSandbox]: '77cefc92-e89f-48f9-8ae1-23dcee412e05-test',
  [Hostname.Dk]: 'bbd4ef29-6ff5-4251-8cdb-0b09154e7190',
  [Hostname.DkSandbox]: 'bbd4ef29-6ff5-4251-8cdb-0b09154e7190-test',
  [Hostname.Ee]: '0198cc98-1fbf-758c-b149-576b49931caa',
  [Hostname.EeSandbox]: '0198cc98-1fbf-758c-b149-576b49931caa-test',
  [Hostname.Es]: '1d000587-cd97-47a0-a153-ae5e95d7bcd0',
  [Hostname.EsSandbox]: '1d000587-cd97-47a0-a153-ae5e95d7bcd0-test',
  [Hostname.Fr]: '1faba56f-ca85-4225-be79-f1b66164759d',
  [Hostname.FrSandbox]: '1faba56f-ca85-4225-be79-f1b66164759d-test',
  [Hostname.Hu]: 'a9c3a318-16a9-4b1a-9119-f5138d264acc',
  [Hostname.HuSandbox]: 'a9c3a318-16a9-4b1a-9119-f5138d264acc-test',
  [Hostname.Lt]: '9ff8d790-f9a3-4339-93b8-35166410f9a8',
  [Hostname.LtSandbox]: '9ff8d790-f9a3-4339-93b8-35166410f9a8-test',
  [Hostname.Lu]: '2caade4a-9608-45dd-8d3d-3c57e3f10d65',
  [Hostname.LuSandbox]: '2caade4a-9608-45dd-8d3d-3c57e3f10d65-test',
  [Hostname.Lv]: '0198cc3e-f80c-7385-a1ff-9b22f1fd095d',
  [Hostname.LvSandbox]: '0198cc3e-f80c-7385-a1ff-9b22f1fd095d-test',
  [Hostname.Nl]: '6d189325-d5c7-4ad1-b313-04bdd1b4cfd5',
  [Hostname.NlSandbox]: '6d189325-d5c7-4ad1-b313-04bdd1b4cfd5-test',
  [Hostname.Pl]: '1e3b4268-d6b8-4743-b5ec-fc6fa398ed27',
  [Hostname.PlSandbox]: '1e3b4268-d6b8-4743-b5ec-fc6fa398ed27-test',
  [Hostname.Se]: '15351e80-18f5-42a5-94a3-a129323b3fad',
  [Hostname.SeSandbox]: '15351e80-18f5-42a5-94a3-a129323b3fad-test',
  [Hostname.Si]: '0198cc99-581d-7bb5-9f18-069c3f1b7aeb',
  [Hostname.SiSandbox]: '0198cc99-581d-7bb5-9f18-069c3f1b7aeb-test',
  [Hostname.Sk]: '10f633e1-04dd-4dae-81fa-a863c40a9e04',
  [Hostname.SkSandbox]: '10f633e1-04dd-4dae-81fa-a863c40a9e04-test',
  [Hostname.Pt]: '5a16f27d-fc15-4288-89cc-b4bfd125b5b1',
  [Hostname.PtSandbox]: '5a16f27d-fc15-4288-89cc-b4bfd125b5b1-test',
  [Hostname.Uk]: '7c1e0f13-a29f-4cba-9aad-f1d1be84c4e3',
  [Hostname.UkSandbox]: '7c1e0f13-a29f-4cba-9aad-f1d1be84c4e3-test',
  [Hostname.Us]: '00a8b98f-e69a-41a8-b4d8-e7118a39a23a',
  [Hostname.UsSandbox]: '00a8b98f-e69a-41a8-b4d8-e7118a39a23a-test',
  [Hostname.It]: '1b74cfac-ad4f-47c1-a3c9-d71707ac085c',
  [Hostname.ItSandbox]: '1b74cfac-ad4f-47c1-a3c9-d71707ac085c-test',
  [Hostname.Ro]: 'ed81fa23-b427-45c9-ada3-c9e1d3c09fe0',
  [Hostname.RoSandbox]: 'ed81fa23-b427-45c9-ada3-c9e1d3c09fe0-test',
  [Hostname.Fi]: 'b1984a2c-9666-4748-8699-63180f09f606',
  [Hostname.FiSandbox]: 'b1984a2c-9666-4748-8699-63180f09f606-test',
  [Hostname.Hr]: '018e08ef-0f7c-796b-aef1-9c253355a092',
  [Hostname.HrSandbox]: '018e08ef-0f7c-796b-aef1-9c253355a092-test',
  [Hostname.Gr]: '018e83ba-e666-7371-9414-69ea23cf8a2d',
  [Hostname.GrSandbox]: '018e83ba-e666-7371-9414-69ea23cf8a2d-test',
  [Hostname.Ie]: '0190d9ce-a54d-7590-9c37-338be6ef3cfe',
  [Hostname.IeSandbox]: '0190d9ce-a54d-7590-9c37-338be6ef3cfe-test',
}
