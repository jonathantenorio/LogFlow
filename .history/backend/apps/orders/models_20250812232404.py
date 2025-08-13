"""
Modelos para gestão de ordens do LogFlow.
"""

from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _


class Client(models.Model):
    """Cliente para as ordens."""
    
    name = models.CharField(
        max_length=200,
        verbose_name=_('Nome')
    )
    
    email = models.EmailField(
        verbose_name=_('Email')
    )
    
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name=_('Telefone')
    )
    
    address = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Endereço')
    )
    
    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('Cidade')
    )
    
    state = models.CharField(
        max_length=2,
        blank=True,
        null=True,
        verbose_name=_('Estado')
    )
    
    zip_code = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        verbose_name=_('CEP')
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Ativo')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Data de criação')
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Data de atualização')
    )
    
    class Meta:
        verbose_name = _('Cliente')
        verbose_name_plural = _('Clientes')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Order(models.Model):
    """Ordem principal."""
    
    ORDER_TYPES = [
        ('pickup', _('Coleta')),
        ('delivery', _('Entrega')),
        ('withdrawal', _('Retirada')),
        ('transfer', _('Transferência')),
    ]
    
    STATUS_CHOICES = [
        ('pending', _('Pendente')),
        ('processing', _('Em Processamento')),
        ('ready', _('Pronto')),
        ('in_transit', _('Em Trânsito')),
        ('completed', _('Concluída')),
        ('cancelled', _('Cancelada')),
    ]
    
    PRIORITY_CHOICES = [
        ('low', _('Baixa')),
        ('normal', _('Normal')),
        ('high', _('Alta')),
        ('urgent', _('Urgente')),
    ]
    
    # Informações básicas
    order_number = models.CharField(
        max_length=20,
        unique=True,
        verbose_name=_('Número da Ordem')
    )
    
    order_type = models.CharField(
        max_length=20,
        choices=ORDER_TYPES,
        verbose_name=_('Tipo de Ordem')
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name=_('Status')
    )
    
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='normal',
        verbose_name=_('Prioridade')
    )
    
    # Cliente e localização
    client = models.ForeignKey(
        Client,
        on_delete=models.PROTECT,
        verbose_name=_('Cliente')
    )
    
    pickup_address = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Endereço de Coleta')
    )
    
    delivery_address = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Endereço de Entrega')
    )
    
    # Datas
    requested_date = models.DateTimeField(
        verbose_name=_('Data Solicitada')
    )
    
    scheduled_date = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name=_('Data Agendada')
    )
    
    completed_date = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name=_('Data de Conclusão')
    )
    
    # Informações adicionais
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Descrição')
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Observações')
    )
    
    total_weight = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        default=0,
        verbose_name=_('Peso Total (kg)')
    )
    
    total_volume = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        default=0,
        verbose_name=_('Volume Total (m³)')
    )
    
    # Controle
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        related_name='orders_created',
        verbose_name=_('Criado por')
    )
    
    assigned_to = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='orders_assigned',
        verbose_name=_('Atribuído a')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Data de criação')
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Data de atualização')
    )
    
    class Meta:
        verbose_name = _('Ordem')
        verbose_name_plural = _('Ordens')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['order_type', 'status']),
            models.Index(fields=['client', 'created_at']),
            models.Index(fields=['status', 'priority']),
        ]
    
    def __str__(self):
        return f"{self.order_number} - {self.get_order_type_display()}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            # Gera número da ordem automaticamente
            last_order = Order.objects.order_by('-id').first()
            if last_order:
                last_number = int(last_order.order_number.split('-')[1])
                self.order_number = f"ORD-{last_number + 1:06d}"
            else:
                self.order_number = "ORD-000001"
        
        super().save(*args, **kwargs)
    
    @property
    def total_items(self):
        """Retorna o total de itens na ordem."""
        return self.items.count()
    
    @property
    def is_overdue(self):
        """Verifica se a ordem está atrasada."""
        if self.scheduled_date and self.status not in ['completed', 'cancelled']:
            from django.utils import timezone
            return timezone.now() > self.scheduled_date
        return False


class OrderItem(models.Model):
    """Item de uma ordem."""
    
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('Ordem')
    )
    
    product = models.ForeignKey(
        'inventory.Product',
        on_delete=models.PROTECT,
        verbose_name=_('Produto')
    )
    
    quantity = models.IntegerField(
        validators=[MinValueValidator(1)],
        verbose_name=_('Quantidade')
    )
    
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name=_('Preço Unitário')
    )
    
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name=_('Preço Total')
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Observações')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Data de criação')
    )
    
    class Meta:
        verbose_name = _('Item da Ordem')
        verbose_name_plural = _('Itens da Ordem')
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.order.order_number} - {self.product.name} x{self.quantity}"
    
    def save(self, *args, **kwargs):
        # Calcula o preço total
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)


class OrderStatus(models.Model):
    """Histórico de status da ordem."""
    
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='status_history',
        verbose_name=_('Ordem')
    )
    
    status = models.CharField(
        max_length=20,
        choices=Order.STATUS_CHOICES,
        verbose_name=_('Status')
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Observações')
    )
    
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        verbose_name=_('Alterado por')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Data de alteração')
    )
    
    class Meta:
        verbose_name = _('Histórico de Status')
        verbose_name_plural = _('Histórico de Status')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.order.order_number} - {self.get_status_display()}"


class OrderDocument(models.Model):
    """Documento anexado à ordem."""
    
    DOCUMENT_TYPES = [
        ('invoice', _('Nota Fiscal')),
        ('packing_list', _('Lista de Embalagem')),
        ('delivery_note', _('Nota de Entrega')),
        ('receipt', _('Recibo')),
        ('other', _('Outro')),
    ]
    
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name=_('Ordem')
    )
    
    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPES,
        verbose_name=_('Tipo de Documento')
    )
    
    title = models.CharField(
        max_length=200,
        verbose_name=_('Título')
    )
    
    file = models.FileField(
        upload_to='orders/documents/',
        verbose_name=_('Arquivo')
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Descrição')
    )
    
    uploaded_by = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        verbose_name=_('Enviado por')
    )
    
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Data de envio')
    )
    
    class Meta:
        verbose_name = _('Documento da Ordem')
        verbose_name_plural = _('Documentos da Ordem')
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.order.order_number} - {self.title}"
