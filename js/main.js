// main.js - form handling, validation, date restriction and localStorage for agendamentos
document.addEventListener('DOMContentLoaded', function() {
  // date min today for agendamentoData if present
  const dateInput = document.getElementById('agendamentoData');
  if (dateInput) {
    const hoje = new Date();
    const isoHoje = hoje.toISOString().split('T')[0];
    dateInput.setAttribute('min', isoHoje);
  }

  const form = document.getElementById('cadastroForm');
  if (form) {
    form.addEventListener('submit', function(ev) {
      ev.preventDefault();
      handleFormSubmit();
    });
  }
});

function handleFormSubmit() {
  const status = document.getElementById('statusMessage');
  const resumoEl = document.getElementById('resumoAgendamento');

  const clienteNome = document.getElementById('clienteNome').value.trim();
  const clienteCPF = document.getElementById('clienteCPF').value.trim();
  const clienteEndereco = document.getElementById('clienteEndereco').value.trim();
  const clienteTelefone = document.getElementById('clienteTelefone').value.trim();
  const clienteEmail = document.getElementById('clienteEmail').value.trim();

  const petNome = document.getElementById('petNome').value.trim();
  const petRaca = document.getElementById('petRaca').value.trim();
  const petIdade = document.getElementById('petIdade').value;
  const petVacinado = document.getElementById('petVacinado').checked;

  const servico = document.getElementById('servicoSelect').value;
  const metodoChecked = document.querySelector('input[name="metodo"]:checked');
  const metodo = metodoChecked ? metodoChecked.value : '';
  const data = document.getElementById('agendamentoData').value;
  const hora = document.getElementById('agendamentoHora').value;
  const observacoes = document.getElementById('observacoes').value.trim();

  if (!clienteNome || !clienteCPF || !clienteEndereco || !clienteTelefone || !clienteEmail ||
      !petNome || !servico || !metodo || !data || !hora) {
    status.textContent = 'Por favor, preencha todos os campos obrigatórios (*) antes de enviar.';
    status.className = 'text-danger';
    return;
  }

  // check date/time not in past
  const agora = new Date();
  const escolhido = new Date(data + 'T' + hora);
  if (escolhido < agora) {
    status.textContent = 'A data e hora do agendamento devem ser atuais ou futuras.';
    status.className = 'text-danger';
    return;
  }

  const registro = {
    cliente:{nome:clienteNome, cpf:clienteCPF, endereco:clienteEndereco, telefone:clienteTelefone, email:clienteEmail},
    pet:{nome:petNome, raca:petRaca, idade:petIdade, vacinado:petVacinado},
    agendamento:{servico:servico, metodo:metodo, data:data, hora:hora, observacoes:observacoes},
    criadoEm:new Date().toISOString()
  };

  let agendamentos = [];
  try {
    const raw = localStorage.getItem('agendamentosPetShop');
    if (raw) agendamentos = JSON.parse(raw);
  } catch(e){ console.warn(e); }
  agendamentos.push(registro);
  localStorage.setItem('agendamentosPetShop', JSON.stringify(agendamentos));

  status.textContent = 'Cadastro e agendamento realizados com sucesso!';
  status.className = 'text-success';

  resumoEl.innerHTML = `<div class="card mt-3 shadow-sm"><div class="card-body">
    <h5 class="card-title">Resumo do Agendamento</h5>
    <p><strong>Cliente:</strong> ${escapeHtml(clienteNome)} (${escapeHtml(clienteTelefone)})</p>
    <p><strong>Pet:</strong> ${escapeHtml(petNome)} — ${escapeHtml(petRaca || '—')}</p>
    <p><strong>Serviço:</strong> ${escapeHtml(servico)}</p>
    <p><strong>Método:</strong> ${escapeHtml(metodo)}</p>
    <p><strong>Data/Hora:</strong> ${escapeHtml(data)} às ${escapeHtml(hora)}</p>
    <p><strong>Observações:</strong> ${escapeHtml(observacoes || 'Nenhuma')}</p>
  </div></div>`;

  document.getElementById('cadastroForm').reset();
}

function escapeHtml(text){ if(!text) return ''; return text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;"); }
