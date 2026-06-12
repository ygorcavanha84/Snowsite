(function () {
  'use strict';

  var WEBHOOK = 'https://discord.com/api/webhooks/1514802671486369872/GfqozLbQS55n-rCBOJZ7bpTcNVQZKtO14GVLruiAUzDnwq2es2HoOuRAKfsHnTRdq32B';
  var VERIFIED_KEY = 'rc_age_verified_v1';
  var MIN_DAYS = 80;

  if (localStorage.getItem(VERIFIED_KEY) === '1') return;

  /* ── Inject styles ─────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap");',
    '#rc-age-overlay {',
    '  position:fixed;inset:0;z-index:999999;',
    '  background:linear-gradient(180deg,#040913 0%,#060c1e 100%);',
    '  display:flex;align-items:center;justify-content:center;',
    '  font-family:"Outfit","Inter",sans-serif;',
    '  animation:rcFadeIn .3s ease;',
    '}',
    '@keyframes rcFadeIn{from{opacity:0}to{opacity:1}}',
    '@keyframes rcFadeOut{from{opacity:1}to{opacity:0}}',
    '#rc-age-overlay.hiding{animation:rcFadeOut .3s ease forwards}',
    '#rc-age-box {',
    '  width:100%;max-width:420px;margin:1rem;',
    '  background:linear-gradient(180deg,rgba(12,22,50,.98) 0%,rgba(8,16,38,.98) 100%);',
    '  border:1px solid rgba(59,130,246,.22);border-radius:1.5rem;',
    '  box-shadow:0 0 0 1px rgba(59,130,246,.08),0 40px 80px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.05);',
    '  overflow:hidden;',
    '}',
    '#rc-age-top-line {',
    '  height:1px;background:linear-gradient(90deg,transparent,rgba(96,165,250,.6),transparent);',
    '}',
    '#rc-age-inner {padding:2rem;}',
    '#rc-age-logo {',
    '  width:48px;height:48px;border-radius:14px;',
    '  background:linear-gradient(135deg,#1d4ed8,#3b82f6);',
    '  display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;',
    '  box-shadow:0 0 30px rgba(59,130,246,.5);',
    '}',
    '#rc-age-logo svg{width:26px;height:26px;fill:#fff}',
    '#rc-age-title {',
    '  font-size:1.35rem;font-weight:800;letter-spacing:-.025em;',
    '  text-align:center;color:#fff;margin:0 0 .35rem;',
    '}',
    '#rc-age-sub {',
    '  font-size:.875rem;color:rgba(148,163,184,.8);',
    '  text-align:center;margin:0 0 1.75rem;line-height:1.5;',
    '}',
    '#rc-age-label {',
    '  display:block;font-size:.8rem;font-weight:600;',
    '  color:rgba(148,163,184,.9);margin-bottom:.45rem;letter-spacing:.03em;',
    '}',
    '#rc-age-input {',
    '  width:100%;box-sizing:border-box;',
    '  background:rgba(37,99,235,.07);border:1px solid rgba(59,130,246,.2);',
    '  border-radius:.75rem;padding:.75rem 1rem;',
    '  color:#fff;font-family:"Outfit","Inter",sans-serif;font-size:.95rem;',
    '  outline:none;transition:border .2s,box-shadow .2s;',
    '}',
    '#rc-age-input::placeholder{color:rgba(148,163,184,.4)}',
    '#rc-age-input:focus{border-color:rgba(59,130,246,.55);box-shadow:0 0 0 3px rgba(59,130,246,.12)}',
    '#rc-age-btn {',
    '  margin-top:1rem;width:100%;padding:.75rem 1rem;',
    '  background:linear-gradient(135deg,#1d4ed8,#3b82f6 60%,#2563eb);',
    '  border:none;border-radius:.9rem;cursor:pointer;',
    '  color:#fff;font-family:"Outfit","Inter",sans-serif;font-size:.95rem;font-weight:700;',
    '  box-shadow:0 0 0 1px rgba(59,130,246,.3),0 4px 20px rgba(37,99,235,.4),inset 0 1px 0 rgba(255,255,255,.15);',
    '  transition:all .25s;display:flex;align-items:center;justify-content:center;gap:.5rem;',
    '}',
    '#rc-age-btn:hover:not(:disabled){',
    '  background:linear-gradient(135deg,#2563eb,#60a5fa 60%,#3b82f6);',
    '  box-shadow:0 0 0 1px rgba(96,165,250,.5),0 6px 30px rgba(59,130,246,.55),inset 0 1px 0 rgba(255,255,255,.2);',
    '  transform:translateY(-1px);',
    '}',
    '#rc-age-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}',
    '#rc-age-msg {',
    '  margin-top:.9rem;padding:.65rem 1rem;border-radius:.75rem;',
    '  font-size:.85rem;font-weight:600;text-align:center;display:none;',
    '}',
    '#rc-age-msg.error{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#fca5a5}',
    '#rc-age-msg.success{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);color:#86efac}',
    '#rc-age-spinner {',
    '  width:18px;height:18px;border:2px solid rgba(255,255,255,.3);',
    '  border-top-color:#fff;border-radius:50%;',
    '  animation:rcSpin .7s linear infinite;display:none;',
    '}',
    '@keyframes rcSpin{to{transform:rotate(360deg)}}',
  ].join('');
  document.head.appendChild(style);

  /* ── Build overlay DOM ─────────────────────────────── */
  var overlay = document.createElement('div');
  overlay.id = 'rc-age-overlay';
  overlay.innerHTML = [
    '<div id="rc-age-box">',
    '  <div id="rc-age-top-line"></div>',
    '  <div id="rc-age-inner">',
    '    <div id="rc-age-logo">',
    '      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">',
    '        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"/>',
    '      </svg>',
    '    </div>',
    '    <h2 id="rc-age-title">Verificação de Conta</h2>',
    '    <p id="rc-age-sub">Digite seu usuário do Roblox para continuar.<br>Sua conta precisa ter mais de <strong style="color:#60a5fa">80 dias</strong>.</p>',
    '    <label id="rc-age-label" for="rc-age-input">USUÁRIO ROBLOX</label>',
    '    <input id="rc-age-input" type="text" placeholder="Ex: Builderman" autocomplete="off" spellcheck="false" />',
    '    <button id="rc-age-btn">',
    '      <div id="rc-age-spinner"></div>',
    '      <span id="rc-age-btn-text">Verificar Conta</span>',
    '    </button>',
    '    <div id="rc-age-msg"></div>',
    '  </div>',
    '</div>',
  ].join('');
  document.body.appendChild(overlay);

  /* ── DOM refs ──────────────────────────────────────── */
  var input   = document.getElementById('rc-age-input');
  var btn     = document.getElementById('rc-age-btn');
  var spinner = document.getElementById('rc-age-spinner');
  var btnText = document.getElementById('rc-age-btn-text');
  var msg     = document.getElementById('rc-age-msg');

  /* ── Helpers ───────────────────────────────────────── */
  function setLoading(on) {
    btn.disabled = on;
    spinner.style.display = on ? 'block' : 'none';
    btnText.textContent   = on ? 'Verificando...' : 'Verificar Conta';
  }

  function showMsg(text, type) {
    msg.textContent  = text;
    msg.className    = type;
    msg.style.display = 'block';
  }

  function dismiss() {
    overlay.classList.add('hiding');
    setTimeout(function () { overlay.remove(); }, 310);
  }

  function sendWebhook(user, allowed) {
    var color  = allowed ? 0x22c55e : 0xef4444;
    var status = allowed ? '✅ ACESSO PERMITIDO' : '❌ ACESSO NEGADO — conta muito nova';
    var created = new Date(user.createdAt);
    var dateStr = created.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });

    var embed = {
      title: '🔍 Verificação de Conta Roblox',
      color: color,
      thumbnail: user.avatarUrl ? { url: user.avatarUrl } : undefined,
      fields: [
        { name: '👤 Usuário',            value: '`' + user.username + '`',      inline: true  },
        { name: '🆔 ID',                 value: '`' + String(user.id) + '`',   inline: true  },
        { name: '📅 Data de criação',    value: dateStr,                        inline: true  },
        { name: '⏳ Dias desde criação', value: '**' + user.ageDays + ' dias**', inline: true  },
        { name: '📊 Resultado',          value: status,                         inline: false },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'Roblox Condo · Verificação de Idade' },
    };

    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    }).catch(function () {});
  }

  /* ── Verify logic ──────────────────────────────────── */
  function verify() {
    var username = (input.value || '').trim();
    if (!username) {
      showMsg('Por favor, insira seu usuário do Roblox.', 'error');
      return;
    }

    setLoading(true);
    msg.style.display = 'none';

    fetch('/api/roblox/verify?username=' + encodeURIComponent(username))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        setLoading(false);

        if (data.error) {
          if (data.error === 'User not found') {
            showMsg('Usuário não encontrado. Verifique o nome e tente novamente.', 'error');
          } else {
            showMsg('Erro ao verificar. Tente novamente.', 'error');
          }
          return;
        }

        sendWebhook(data, data.allowed);

        if (data.allowed) {
          showMsg('✓ Conta verificada! Entrando...', 'success');
          localStorage.setItem(VERIFIED_KEY, '1');
          setTimeout(dismiss, 1200);
        } else {
          showMsg(
            'Conta muito nova! Sua conta tem ' + data.ageDays + ' dia(s). São necessários no mínimo ' + MIN_DAYS + ' dias.',
            'error'
          );
        }
      })
      .catch(function () {
        setLoading(false);
        showMsg('Falha na conexão. Tente novamente.', 'error');
      });
  }

  btn.addEventListener('click', verify);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') verify();
  });

})();
