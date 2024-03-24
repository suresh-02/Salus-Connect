import {
  S as Z,
  i as K,
  s as X,
  e as u,
  t as _,
  k as w,
  c as h,
  a as g,
  h as x,
  d as c,
  m as k,
  b as m,
  g as J,
  I as i,
  j as he,
  J as M,
  H as xe,
  n as Pe,
  o as P,
  p as De,
  q as D,
  w as E,
  x as V,
  y as A,
  B as q,
} from "../chunks/vendor-dc0336cb.js";
function Ie(o) {
  let e, a, n, l, t, r, d, s, f;
  return {
    c() {
      (e = u("div")),
        (a = u("div")),
        (n = _(o[0])),
        (l = w()),
        (t = u("div")),
        (r = _(o[1])),
        (d = w()),
        (s = u("div")),
        (f = _(o[2])),
        this.h();
    },
    l(p) {
      e = h(p, "DIV", { class: !0 });
      var y = g(e);
      a = h(y, "DIV", { class: !0 });
      var I = g(a);
      (n = x(I, o[0])),
        I.forEach(c),
        (l = k(y)),
        (t = h(y, "DIV", { class: !0 }));
      var W = g(t);
      (r = x(W, o[1])),
        W.forEach(c),
        (d = k(y)),
        (s = h(y, "DIV", { class: !0 }));
      var j = g(s);
      (f = x(j, o[2])), j.forEach(c), y.forEach(c), this.h();
    },
    h() {
      m(
        a,
        "class",
        "title uppercase font-light text-center tablet:text-left tablet:text-xl"
      ),
        m(t, "class", "text-2xl tablet:text-4xl desktop:text-5xl font-bold"),
        m(
          s,
          "class",
          "whitespace-pre-line text-sm tablet:text-lg desktop:text-xl"
        ),
        m(e, "class", "explanation flex flex-col space-y-3 tablet:w-2/3");
    },
    m(p, y) {
      J(p, e, y),
        i(e, a),
        i(a, n),
        i(e, l),
        i(e, t),
        i(t, r),
        i(e, d),
        i(e, s),
        i(s, f);
    },
    p(p, [y]) {
      y & 1 && he(n, p[0]), y & 2 && he(r, p[1]), y & 4 && he(f, p[2]);
    },
    i: M,
    o: M,
    d(p) {
      p && c(e);
    },
  };
}
function $e(o, e, a) {
  let { title: n } = e,
    { heading: l } = e,
    { message: t } = e;
  return (
    (o.$$set = (r) => {
      "title" in r && a(0, (n = r.title)),
        "heading" in r && a(1, (l = r.heading)),
        "message" in r && a(2, (t = r.message));
    }),
    [n, l, t]
  );
}
class we extends Z {
  constructor(e) {
    super();
    K(this, e, $e, Ie, X, { title: 0, heading: 1, message: 2 });
  }
}
function Se(o) {
  let e, a, n;
  return {
    c() {
      (e = u("div")), (a = u("img")), this.h();
    },
    l(l) {
      e = h(l, "DIV", { class: !0 });
      var t = g(e);
      (a = h(t, "IMG", { class: !0, src: !0, alt: !0 })),
        t.forEach(c),
        this.h();
    },
    h() {
      m(a, "class", "object-scale-down"),
        xe(a.src, (n = o[0])) || m(a, "src", n),
        m(a, "alt", "sample screenshot"),
        m(e, "class", "image flex justify-center");
    },
    m(l, t) {
      J(l, e, t), i(e, a);
    },
    p(l, [t]) {
      t & 1 && !xe(a.src, (n = l[0])) && m(a, "src", n);
    },
    i: M,
    o: M,
    d(l) {
      l && c(e);
    },
  };
}
function Ee(o, e, a) {
  let { imagePath: n } = e;
  return (
    (o.$$set = (l) => {
      "imagePath" in l && a(0, (n = l.imagePath));
    }),
    [n]
  );
}
class ke extends Z {
  constructor(e) {
    super();
    K(this, e, Ee, Se, X, { imagePath: 0 });
  }
}
function Ve(o) {
  let e, a, n, l;
  return (
    (e = new we({ props: { title: o[0], heading: o[1], message: o[2] } })),
    (n = new ke({ props: { imagePath: o[3] } })),
    {
      c() {
        E(e.$$.fragment), (a = w()), E(n.$$.fragment);
      },
      l(t) {
        V(e.$$.fragment, t), (a = k(t)), V(n.$$.fragment, t);
      },
      m(t, r) {
        A(e, t, r), J(t, a, r), A(n, t, r), (l = !0);
      },
      p(t, r) {
        const d = {};
        r & 1 && (d.title = t[0]),
          r & 2 && (d.heading = t[1]),
          r & 4 && (d.message = t[2]),
          e.$set(d);
        const s = {};
        r & 8 && (s.imagePath = t[3]), n.$set(s);
      },
      i(t) {
        l || (D(e.$$.fragment, t), D(n.$$.fragment, t), (l = !0));
      },
      o(t) {
        P(e.$$.fragment, t), P(n.$$.fragment, t), (l = !1);
      },
      d(t) {
        q(e, t), t && c(a), q(n, t);
      },
    }
  );
}
function Ae(o) {
  let e, a, n, l;
  return (
    (e = new ke({ props: { imagePath: o[3] } })),
    (n = new we({ props: { title: o[0], heading: o[1], message: o[2] } })),
    {
      c() {
        E(e.$$.fragment), (a = w()), E(n.$$.fragment);
      },
      l(t) {
        V(e.$$.fragment, t), (a = k(t)), V(n.$$.fragment, t);
      },
      m(t, r) {
        A(e, t, r), J(t, a, r), A(n, t, r), (l = !0);
      },
      p(t, r) {
        const d = {};
        r & 8 && (d.imagePath = t[3]), e.$set(d);
        const s = {};
        r & 1 && (s.title = t[0]),
          r & 2 && (s.heading = t[1]),
          r & 4 && (s.message = t[2]),
          n.$set(s);
      },
      i(t) {
        l || (D(e.$$.fragment, t), D(n.$$.fragment, t), (l = !0));
      },
      o(t) {
        P(e.$$.fragment, t), P(n.$$.fragment, t), (l = !1);
      },
      d(t) {
        q(e, t), t && c(a), q(n, t);
      },
    }
  );
}
function qe(o) {
  let e, a, n, l;
  const t = [Ae, Ve],
    r = [];
  function d(s, f) {
    return s[4] ? 0 : 1;
  }
  return (
    (a = d(o)),
    (n = r[a] = t[a](o)),
    {
      c() {
        (e = u("div")), n.c(), this.h();
      },
      l(s) {
        e = h(s, "DIV", { class: !0 });
        var f = g(e);
        n.l(f), f.forEach(c), this.h();
      },
      h() {
        m(
          e,
          "class",
          "flex flex-col tablet:flex-row space-y-4 tablet:space-y-0 px-5 tablet:px-8 desktop:px-32 tablet:space-x-4"
        );
      },
      m(s, f) {
        J(s, e, f), r[a].m(e, null), (l = !0);
      },
      p(s, [f]) {
        let p = a;
        (a = d(s)),
          a === p
            ? r[a].p(s, f)
            : (Pe(),
              P(r[p], 1, 1, () => {
                r[p] = null;
              }),
              De(),
              (n = r[a]),
              n ? n.p(s, f) : ((n = r[a] = t[a](s)), n.c()),
              D(n, 1),
              n.m(e, null));
      },
      i(s) {
        l || (D(n), (l = !0));
      },
      o(s) {
        P(n), (l = !1);
      },
      d(s) {
        s && c(e), r[a].d();
      },
    }
  );
}
function Ce(o, e, a) {
  let { title: n } = e,
    { heading: l } = e,
    { message: t } = e,
    { imagePath: r } = e,
    { imageIsPrimary: d } = e;
  return (
    (o.$$set = (s) => {
      "title" in s && a(0, (n = s.title)),
        "heading" in s && a(1, (l = s.heading)),
        "message" in s && a(2, (t = s.message)),
        "imagePath" in s && a(3, (r = s.imagePath)),
        "imageIsPrimary" in s && a(4, (d = s.imageIsPrimary));
    }),
    [n, l, t, r, d]
  );
}
class Y extends Z {
  constructor(e) {
    super();
    K(this, e, Ce, qe, X, {
      title: 0,
      heading: 1,
      message: 2,
      imagePath: 3,
      imageIsPrimary: 4,
    });
  }
}
function Te(o) {
  let e,
    a,
    n,
    l,
    t,
    r,
    d,
    s,
    f,
    p,
    y,
    I,
    W,
    j,
    $,
    ee,
    z,
    te,
    ae,
    ne,
    C,
    se,
    T,
    re,
    F,
    ie,
    L,
    le,
    S,
    B,
    oe,
    ce,
    N,
    me,
    H,
    de,
    R;
  return (
    (C = new Y({
      props: {
        imageIsPrimary: !1,
        imagePath: "/learnmoredocs-window.png",
        title: "Simplified calendar setting tools",
        heading: "One Window for it all",
        message: `When we started work on SalusConnect back in February 2021, it quickly became apparent that we could do it either the easy way or the right way. \r
        \r
    The easy way would have allowed us to launch in Q3 2021 but would have required us to perform less research, spend less than needed time on product architecture and design and leave important features out which would be truly valuable to Canadians and the medical community.`,
      },
    })),
    (T = new Y({
      props: {
        imageIsPrimary: !0,
        imagePath: "/learnmoredocs-staff.png",
        title: "Role based Access Management",
        heading: "Power to your staff",
        message: `At SalusConnect we understand that support staff at your practice play a key role in the efficient running of  daily operations. \r
\r
    That\u2019s why, apart from the providers themselves, staff can seamlessly enter and manage calendars on behalf of any provider at your practice.\r
    \r
    And when they are done managing one calendar, staff can immediately switch to another provider through the switch pane. \r
    \r
    Doctors on the other hand have full read and edit access to their own calendars.`,
      },
    })),
    (F = new Y({
      props: {
        imageIsPrimary: !1,
        imagePath: "/learnmoredocs-autoapprovals.png",
        title: "Auto Approvals on tap",
        heading: "Set it and forget it",
        message: `Auto approvals or Instant Bookings are a people favorite and a proven way to enhance user experience. When enabled, patients are able to find and book available appointment slots on your calendar without you needing to approve them manually. \r
\r
    And all this can be enabled or disabled with a simple selection. Think about after business hours. Magic.`,
      },
    })),
    (L = new Y({
      props: {
        imageIsPrimary: !0,
        imagePath: "/learnmoredocs-gettingstarted.png",
        title: "Zero starter costs",
        heading: "Get started in minutes",
        message: `Your aspirations to grow your practice no longer need to be bound by technology limitations. \r
\r
    Whether you accept appointments through your website\u2019s native webform or you don\u2019t have a web-based appointment booking mechanism at all, SalusConnect can get you going in no time and with minimal effort.\r
    \r
    The best part. SalusConnect is fully hosted in the cloud and only needs an active internet connection. Pick a device of your choice to utilize the full capabilities of the platform and get started.`,
      },
    })),
    {
      c() {
        (e = u("div")),
          (a = u("div")),
          (n = u("div")),
          (l = _("SalusConnect for the ")),
          (t = u("span")),
          (r = _("medical community")),
          (d = w()),
          (s = u("div")),
          (f = u("div")),
          (p =
            _(`SalusConnect is thoughtfully engineered as much for Canada\u2019s doctors and medical practioners as it is for all Canadians.\r
\r
                For young or smaller practices, SalusConnect can instantly modernize your booking process while giving you potentially exponential reach and visibility.\r
                \r
                For larger and more established practices, SalusConnect can streamline your appointment management workflow across all providers and staff members in your practice.`)),
          (y = w()),
          (I = u("button")),
          (W = _("Request to Join")),
          (j = w()),
          ($ = u("div")),
          (ee = _(`SalusConnect can do \r
    `)),
          (z = u("span")),
          (te = _("so many things")),
          (ae = _(" for you.")),
          (ne = w()),
          E(C.$$.fragment),
          (se = w()),
          E(T.$$.fragment),
          (re = w()),
          E(F.$$.fragment),
          (ie = w()),
          E(L.$$.fragment),
          (le = w()),
          (S = u("div")),
          (B = u("div")),
          (oe = _("Have a question?")),
          (ce = w()),
          (N = u("div")),
          (me = _("Please send us an email at ")),
          (H = u("span")),
          (de = _("onboard@salusconnect.ca")),
          this.h();
      },
      l(b) {
        e = h(b, "DIV", { class: !0 });
        var v = g(e);
        a = h(v, "DIV", { class: !0 });
        var G = g(a);
        n = h(G, "DIV", { class: !0 });
        var fe = g(n);
        (l = x(fe, "SalusConnect for the ")),
          (t = h(fe, "SPAN", { class: !0 }));
        var ge = g(t);
        (r = x(ge, "medical community")),
          ge.forEach(c),
          fe.forEach(c),
          (d = k(G)),
          (s = h(G, "DIV", { class: !0 }));
        var O = g(s);
        f = h(O, "DIV", { class: !0 });
        var pe = g(f);
        (p = x(
          pe,
          `SalusConnect is thoughtfully engineered as much for Canada\u2019s doctors and medical practioners as it is for all Canadians.\r
\r
                For young or smaller practices, SalusConnect can instantly modernize your booking process while giving you potentially exponential reach and visibility.\r
                \r
                For larger and more established practices, SalusConnect can streamline your appointment management workflow across all providers and staff members in your practice.`
        )),
          pe.forEach(c),
          (y = k(O)),
          (I = h(O, "BUTTON", { class: !0 }));
        var ye = g(I);
        (W = x(ye, "Request to Join")),
          ye.forEach(c),
          O.forEach(c),
          G.forEach(c),
          (j = k(v)),
          ($ = h(v, "DIV", { class: !0 }));
        var Q = g($);
        (ee = x(
          Q,
          `SalusConnect can do \r
    `
        )),
          (z = h(Q, "SPAN", { class: !0 }));
        var ve = g(z);
        (te = x(ve, "so many things")),
          ve.forEach(c),
          (ae = x(Q, " for you.")),
          Q.forEach(c),
          (ne = k(v)),
          V(C.$$.fragment, v),
          (se = k(v)),
          V(T.$$.fragment, v),
          (re = k(v)),
          V(F.$$.fragment, v),
          (ie = k(v)),
          V(L.$$.fragment, v),
          (le = k(v)),
          (S = h(v, "DIV", { class: !0 }));
        var U = g(S);
        B = h(U, "DIV", { class: !0 });
        var be = g(B);
        (oe = x(be, "Have a question?")),
          be.forEach(c),
          (ce = k(U)),
          (N = h(U, "DIV", { class: !0 }));
        var ue = g(N);
        (me = x(ue, "Please send us an email at ")),
          (H = h(ue, "SPAN", { class: !0 }));
        var _e = g(H);
        (de = x(_e, "onboard@salusconnect.ca")),
          _e.forEach(c),
          ue.forEach(c),
          U.forEach(c),
          v.forEach(c),
          this.h();
      },
      h() {
        m(t, "class", "text-blue-500"),
          m(
            n,
            "class",
            "w-1/2 font-bold text-2xl tablet:text-5xl desktop:text-7xl text-center"
          ),
          m(
            f,
            "class",
            "font-light text-sm tablet:text-base desktop:text-xl whitespace-pre-line"
          ),
          m(I, "class", "hidden tablet:block w-36 h-10 bg-black text-white "),
          m(s, "class", "flex flex-col space-y-2 w-1/2 align-middle"),
          m(
            a,
            "class",
            "lmdocs-header flex px-5 space-x-5 items-center tablet:px-8 desktop:px-20"
          ),
          m(z, "class", "text-blue-500"),
          m(
            $,
            "class",
            "hidden tablet:block whitespace-pre-line text-4xl font-bold text-center"
          ),
          m(B, "class", "font-bold text-2xl tablet:text-4xl "),
          m(H, "class", "font-bold"),
          m(N, "class", "text-sm tablet:text-xl"),
          m(S, "class", "flex flex-col space-y-3 text-center"),
          m(
            e,
            "class",
            "main-layout flex flex-col space-y-6 tablet:space-y-8 desktop:space-y-16 "
          );
      },
      m(b, v) {
        J(b, e, v),
          i(e, a),
          i(a, n),
          i(n, l),
          i(n, t),
          i(t, r),
          i(a, d),
          i(a, s),
          i(s, f),
          i(f, p),
          i(s, y),
          i(s, I),
          i(I, W),
          i(e, j),
          i(e, $),
          i($, ee),
          i($, z),
          i(z, te),
          i($, ae),
          i(e, ne),
          A(C, e, null),
          i(e, se),
          A(T, e, null),
          i(e, re),
          A(F, e, null),
          i(e, ie),
          A(L, e, null),
          i(e, le),
          i(e, S),
          i(S, B),
          i(B, oe),
          i(S, ce),
          i(S, N),
          i(N, me),
          i(N, H),
          i(H, de),
          (R = !0);
      },
      p: M,
      i(b) {
        R ||
          (D(C.$$.fragment, b),
          D(T.$$.fragment, b),
          D(F.$$.fragment, b),
          D(L.$$.fragment, b),
          (R = !0));
      },
      o(b) {
        P(C.$$.fragment, b),
          P(T.$$.fragment, b),
          P(F.$$.fragment, b),
          P(L.$$.fragment, b),
          (R = !1);
      },
      d(b) {
        b && c(e), q(C), q(T), q(F), q(L);
      },
    }
  );
}
class Le extends Z {
  constructor(e) {
    super();
    K(this, e, null, Te, X, {});
  }
}
export { Le as default };
