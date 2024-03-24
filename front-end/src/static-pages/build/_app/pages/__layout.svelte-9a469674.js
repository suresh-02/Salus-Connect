import {
  S as re,
  i as ne,
  s as ae,
  e as v,
  k as _,
  t as le,
  F as ye,
  c as h,
  a as p,
  m as w,
  h as ie,
  d as $,
  G as De,
  b as m,
  H as he,
  g as X,
  I as n,
  J as W,
  j as Ve,
  K as ke,
  w as D,
  x as b,
  f as Se,
  y as E,
  q as I,
  o as x,
  B as V,
  L as Me,
  M as Ae,
  N as Ce,
  O as Fe,
} from "../chunks/vendor-dc0336cb.js";
function Le(d) {
  let t, s, a, i, l, u, r, e, f, o, g;
  return {
    c() {
      (t = v("nav")),
        (s = v("div")),
        (a = v("img")),
        (l = _()),
        (u = v("div")),
        (r = v("span")),
        (e = le("Login/Signup")),
        (f = _()),
        (o = ye("svg")),
        (g = ye("path")),
        this.h();
    },
    l(k) {
      t = h(k, "NAV", { class: !0 });
      var S = p(t);
      s = h(S, "DIV", { class: !0 });
      var P = p(s);
      (a = h(P, "IMG", { class: !0, src: !0, alt: !0 })),
        (l = w(P)),
        (u = h(P, "DIV", { class: !0 }));
      var M = p(u);
      r = h(M, "SPAN", {});
      var H = p(r);
      (e = ie(H, "Login/Signup")),
        H.forEach($),
        (f = w(M)),
        (o = De(M, "svg", {
          xmlns: !0,
          class: !0,
          fill: !0,
          viewBox: !0,
          stroke: !0,
          "stroke-width": !0,
        }));
      var L = p(o);
      (g = De(L, "path", {
        "stroke-linecap": !0,
        "stroke-linejoin": !0,
        d: !0,
      })),
        p(g).forEach($),
        L.forEach($),
        M.forEach($),
        P.forEach($),
        S.forEach($),
        this.h();
    },
    h() {
      m(a, "class", "h-6 w-20"),
        he(a.src, (i = "/header-brand-logo.png")) || m(a, "src", i),
        m(a, "alt", "brand-logo"),
        m(g, "stroke-linecap", "round"),
        m(g, "stroke-linejoin", "round"),
        m(g, "d", "M19 9l-7 7-7-7"),
        m(o, "xmlns", "http://www.w3.org/2000/svg"),
        m(o, "class", "h-3 w-3"),
        m(o, "fill", "none"),
        m(o, "viewBox", "0 0 24 24"),
        m(o, "stroke", "currentColor"),
        m(o, "stroke-width", "2"),
        m(u, "class", "flex justify-center items-center"),
        m(s, "class", "m-5 flex flex-row justify-between"),
        m(t, "class", "w-full ");
    },
    m(k, S) {
      X(k, t, S),
        n(t, s),
        n(s, a),
        n(s, l),
        n(s, u),
        n(u, r),
        n(r, e),
        n(u, f),
        n(u, o),
        n(o, g);
    },
    p: W,
    i: W,
    o: W,
    d(k) {
      k && $(t);
    },
  };
}
class Pe extends re {
  constructor(t) {
    super();
    ne(this, t, null, Le, ae, {});
  }
}
function be(d, t, s) {
  const a = d.slice();
  return (a[2] = t[s]), a;
}
function Ee(d) {
  let t,
    s = d[2] + "",
    a;
  return {
    c() {
      (t = v("div")), (a = le(s));
    },
    l(i) {
      t = h(i, "DIV", {});
      var l = p(t);
      (a = ie(l, s)), l.forEach($);
    },
    m(i, l) {
      X(i, t, l), n(t, a);
    },
    p(i, l) {
      l & 2 && s !== (s = i[2] + "") && Ve(a, s);
    },
    d(i) {
      i && $(t);
    },
  };
}
function je(d) {
  let t,
    s,
    a,
    i,
    l,
    u = d[1],
    r = [];
  for (let e = 0; e < u.length; e += 1) r[e] = Ee(be(d, u, e));
  return {
    c() {
      (t = v("div")), (s = v("div")), (a = le(d[0])), (i = _()), (l = v("div"));
      for (let e = 0; e < r.length; e += 1) r[e].c();
      this.h();
    },
    l(e) {
      t = h(e, "DIV", {});
      var f = p(t);
      s = h(f, "DIV", { class: !0 });
      var o = p(s);
      (a = ie(o, d[0])),
        o.forEach($),
        (i = w(f)),
        (l = h(f, "DIV", { class: !0 }));
      var g = p(l);
      for (let k = 0; k < r.length; k += 1) r[k].l(g);
      g.forEach($), f.forEach($), this.h();
    },
    h() {
      m(s, "class", "font-extrabold text-xl"),
        m(l, "class", "flex flex-col space-y-2");
    },
    m(e, f) {
      X(e, t, f), n(t, s), n(s, a), n(t, i), n(t, l);
      for (let o = 0; o < r.length; o += 1) r[o].m(l, null);
    },
    p(e, [f]) {
      if ((f & 1 && Ve(a, e[0]), f & 2)) {
        u = e[1];
        let o;
        for (o = 0; o < u.length; o += 1) {
          const g = be(e, u, o);
          r[o] ? r[o].p(g, f) : ((r[o] = Ee(g)), r[o].c(), r[o].m(l, null));
        }
        for (; o < r.length; o += 1) r[o].d(1);
        r.length = u.length;
      }
    },
    i: W,
    o: W,
    d(e) {
      e && $(t), ke(r, e);
    },
  };
}
function Ue(d, t, s) {
  let { title: a } = t,
    { menuItems: i } = t;
  return (
    (d.$$set = (l) => {
      "title" in l && s(0, (a = l.title)),
        "menuItems" in l && s(1, (i = l.menuItems));
    }),
    [a, i]
  );
}
class A extends re {
  constructor(t) {
    super();
    ne(this, t, Ue, je, ae, { title: 0, menuItems: 1 });
  }
}
function Be(d) {
  let t,
    s,
    a,
    i,
    l,
    u,
    r,
    e,
    f,
    o,
    g,
    k,
    S,
    P,
    M,
    H,
    L,
    Q,
    pe,
    oe,
    y,
    J,
    fe,
    j,
    G,
    ce,
    R,
    me,
    U,
    T,
    ue,
    q,
    $e,
    N,
    de,
    K,
    O,
    _e,
    ge,
    z,
    ve,
    Y;
  return (
    (i = new A({
      props: {
        title: "SalusConnect",
        menuItems: [
          "About Us",
          "Contact",
          "Security",
          "Privacy",
          "Terms of use",
        ],
      },
    })),
    (u = new A({
      props: {
        title: "Social",
        menuItems: ["Twitter", "Instagram", "Meta", "Linkedin"],
      },
    })),
    (f = new A({
      props: {
        title: "For Doctors",
        menuItems: ["Learn More", "Apply to Join", "Pricing"],
      },
    })),
    (g = new A({ props: { title: "For Patients", menuItems: ["FAQs"] } })),
    (S = new A({ props: { title: "Careers", menuItems: ["Join Us"] } })),
    (M = new A({ props: { title: "Media", menuItems: ["Contact Us"] } })),
    (J = new A({
      props: {
        title: "SalusConnect",
        menuItems: [
          "About Us",
          "Contact",
          "Security",
          "Privacy",
          "Terms of use",
        ],
      },
    })),
    (G = new A({
      props: {
        title: "For Doctors",
        menuItems: ["Learn More", "Apply to Join", "Pricing"],
      },
    })),
    (R = new A({ props: { title: "For Patients", menuItems: ["FAQs"] } })),
    (T = new A({ props: { title: "Careers", menuItems: ["Join Us"] } })),
    (q = new A({ props: { title: "Media", menuItems: ["Contact Us"] } })),
    (N = new A({
      props: {
        title: "Social",
        menuItems: ["Twitter", "Instagram", "Meta", "Linkedin"],
      },
    })),
    {
      c() {
        (t = v("div")),
          (s = v("div")),
          (a = v("div")),
          D(i.$$.fragment),
          (l = _()),
          D(u.$$.fragment),
          (r = _()),
          (e = v("div")),
          D(f.$$.fragment),
          (o = _()),
          D(g.$$.fragment),
          (k = _()),
          D(S.$$.fragment),
          (P = _()),
          D(M.$$.fragment),
          (H = _()),
          (L = v("div")),
          (Q = v("img")),
          (oe = _()),
          (y = v("div")),
          D(J.$$.fragment),
          (fe = _()),
          (j = v("div")),
          D(G.$$.fragment),
          (ce = _()),
          D(R.$$.fragment),
          (me = _()),
          (U = v("div")),
          D(T.$$.fragment),
          (ue = _()),
          D(q.$$.fragment),
          ($e = _()),
          D(N.$$.fragment),
          (de = _()),
          (K = v("div")),
          (O = v("img")),
          (ge = _()),
          (z = v("div")),
          (ve = le("Copyright \xA9 SalusConnect, 2022. All Rights Reserved.")),
          this.h();
      },
      l(c) {
        t = h(c, "DIV", { class: !0, style: !0 });
        var B = p(t);
        s = h(B, "DIV", { class: !0 });
        var Z = p(s);
        a = h(Z, "DIV", { class: !0 });
        var ee = p(a);
        b(i.$$.fragment, ee),
          (l = w(ee)),
          b(u.$$.fragment, ee),
          ee.forEach($),
          (r = w(Z)),
          (e = h(Z, "DIV", { class: !0 }));
        var C = p(e);
        b(f.$$.fragment, C),
          (o = w(C)),
          b(g.$$.fragment, C),
          (k = w(C)),
          b(S.$$.fragment, C),
          (P = w(C)),
          b(M.$$.fragment, C),
          (H = w(C)),
          (L = h(C, "DIV", { class: !0 }));
        var we = p(L);
        (Q = h(we, "IMG", { src: !0, alt: !0 })),
          we.forEach($),
          C.forEach($),
          Z.forEach($),
          (oe = w(B)),
          (y = h(B, "DIV", { class: !0 }));
        var F = p(y);
        b(J.$$.fragment, F), (fe = w(F)), (j = h(F, "DIV", { class: !0 }));
        var te = p(j);
        b(G.$$.fragment, te),
          (ce = w(te)),
          b(R.$$.fragment, te),
          te.forEach($),
          (me = w(F)),
          (U = h(F, "DIV", { class: !0 }));
        var se = p(U);
        b(T.$$.fragment, se),
          (ue = w(se)),
          b(q.$$.fragment, se),
          se.forEach($),
          ($e = w(F)),
          b(N.$$.fragment, F),
          (de = w(F)),
          (K = h(F, "DIV", { class: !0 }));
        var Ie = p(K);
        (O = h(Ie, "IMG", { src: !0, alt: !0 })),
          Ie.forEach($),
          F.forEach($),
          (ge = w(B)),
          (z = h(B, "DIV", { class: !0 }));
        var xe = p(z);
        (ve = ie(
          xe,
          "Copyright \xA9 SalusConnect, 2022. All Rights Reserved."
        )),
          xe.forEach($),
          B.forEach($),
          this.h();
      },
      h() {
        m(a, "class", "w-1/2 flex flex-col items-start"),
          he(Q.src, (pe = "/header-brand-logo.png")) || m(Q, "src", pe),
          m(Q, "alt", "Brnad logo"),
          m(L, "class", "w-24 h-8"),
          m(e, "class", "w-1/2 flex flex-col items-start space-y-2"),
          m(s, "class", "mx-5 pt-6 text-white flex tablet:hidden"),
          m(j, "class", "flex flex-col items-start space-y-3"),
          m(U, "class", "flex flex-col items-start space-y-3"),
          he(O.src, (_e = "/header-brand-logo.png")) || m(O, "src", _e),
          m(O, "alt", "Brnad logo"),
          m(K, "class", "w-44 h-14"),
          m(
            y,
            "class",
            "hidden tablet:flex tablet:flex-row tablet:text-white tablet:justify-evenly"
          ),
          m(z, "class", "text-white text-center"),
          m(
            t,
            "class",
            "flex flex-col mt-12 bg-local w-full h-96 tablet:h-56 space-y-5"
          ),
          Se(t, "background-image", "url('/sd-footer.png')");
      },
      m(c, B) {
        X(c, t, B),
          n(t, s),
          n(s, a),
          E(i, a, null),
          n(a, l),
          E(u, a, null),
          n(s, r),
          n(s, e),
          E(f, e, null),
          n(e, o),
          E(g, e, null),
          n(e, k),
          E(S, e, null),
          n(e, P),
          E(M, e, null),
          n(e, H),
          n(e, L),
          n(L, Q),
          n(t, oe),
          n(t, y),
          E(J, y, null),
          n(y, fe),
          n(y, j),
          E(G, j, null),
          n(j, ce),
          E(R, j, null),
          n(y, me),
          n(y, U),
          E(T, U, null),
          n(U, ue),
          E(q, U, null),
          n(y, $e),
          E(N, y, null),
          n(y, de),
          n(y, K),
          n(K, O),
          n(t, ge),
          n(t, z),
          n(z, ve),
          (Y = !0);
      },
      p: W,
      i(c) {
        Y ||
          (I(i.$$.fragment, c),
          I(u.$$.fragment, c),
          I(f.$$.fragment, c),
          I(g.$$.fragment, c),
          I(S.$$.fragment, c),
          I(M.$$.fragment, c),
          I(J.$$.fragment, c),
          I(G.$$.fragment, c),
          I(R.$$.fragment, c),
          I(T.$$.fragment, c),
          I(q.$$.fragment, c),
          I(N.$$.fragment, c),
          (Y = !0));
      },
      o(c) {
        x(i.$$.fragment, c),
          x(u.$$.fragment, c),
          x(f.$$.fragment, c),
          x(g.$$.fragment, c),
          x(S.$$.fragment, c),
          x(M.$$.fragment, c),
          x(J.$$.fragment, c),
          x(G.$$.fragment, c),
          x(R.$$.fragment, c),
          x(T.$$.fragment, c),
          x(q.$$.fragment, c),
          x(N.$$.fragment, c),
          (Y = !1);
      },
      d(c) {
        c && $(t),
          V(i),
          V(u),
          V(f),
          V(g),
          V(S),
          V(M),
          V(J),
          V(G),
          V(R),
          V(T),
          V(q),
          V(N);
      },
    }
  );
}
class Je extends re {
  constructor(t) {
    super();
    ne(this, t, null, Be, ae, {});
  }
}
function Ge(d) {
  let t, s, a, i, l;
  t = new Pe({});
  const u = d[1].default,
    r = Me(u, d, d[0], null);
  return (
    (i = new Je({})),
    {
      c() {
        D(t.$$.fragment), (s = _()), r && r.c(), (a = _()), D(i.$$.fragment);
      },
      l(e) {
        b(t.$$.fragment, e),
          (s = w(e)),
          r && r.l(e),
          (a = w(e)),
          b(i.$$.fragment, e);
      },
      m(e, f) {
        E(t, e, f),
          X(e, s, f),
          r && r.m(e, f),
          X(e, a, f),
          E(i, e, f),
          (l = !0);
      },
      p(e, [f]) {
        r &&
          r.p &&
          (!l || f & 1) &&
          Ae(r, u, e, e[0], l ? Fe(u, e[0], f, null) : Ce(e[0]), null);
      },
      i(e) {
        l || (I(t.$$.fragment, e), I(r, e), I(i.$$.fragment, e), (l = !0));
      },
      o(e) {
        x(t.$$.fragment, e), x(r, e), x(i.$$.fragment, e), (l = !1);
      },
      d(e) {
        V(t, e), e && $(s), r && r.d(e), e && $(a), V(i, e);
      },
    }
  );
}
function Re(d, t, s) {
  let { $$slots: a = {}, $$scope: i } = t;
  return (
    (d.$$set = (l) => {
      "$$scope" in l && s(0, (i = l.$$scope));
    }),
    [i, a]
  );
}
class qe extends re {
  constructor(t) {
    super();
    ne(this, t, Re, Ge, ae, {});
  }
}
export { qe as default };
