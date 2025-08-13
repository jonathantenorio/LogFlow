"""
Modelos para o controle de inventário do LogFlow.
"""

from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _


class Category(models.Model):
    """Categoria de produtos."""
    
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_('Nome')
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Descrição')
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
        verbose_name = _('Categoria')
        verbose_name_plural = _('Categorias')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Produto do inventário."""
    
    UNIT_CHOICES = [
        ('UN', _('Unidade')),
        ('KG', _('Quilograma')),
        ('L', _('Litro')),
        ('M', _('Metro')),
        ('M2', _('Metro Quadrado')),
        ('M3', _('Metro Cúbico')),
        ('CX', _('Caixa')),
        ('PCT', _('Pacote')),
        ('ROL', _('Rolo')),
    ]
    
    STATUS_CHOICES = [
        ('active', _('Ativo')),
        ('inactive', _('Inativo')),
        ('discontinued', _('Descontinuado')),
    ]
    
    # Informações básicas
    code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name=_('Código')
    )
    
    name = models.CharField(
        max_length=200,
        verbose_name=_('Nome')
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Descrição')
    )
    
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        verbose_name=_('Categoria')
    )
    
    # Especificações
    unit = models.CharField(
        max_length=10,
        choices=UNIT_CHOICES,
        default='UN',
        verbose_name=_('Unidade')
    )
    
    weight = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        blank=True,
        null=True,
        verbose_name=_('Peso (kg)')
    )
    
    dimensions = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('Dimensões (CxLxA)')
    )
    
    # Controle de estoque
    current_stock = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name=_('Estoque Atual')
    )
    
    minimum_stock = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name=_('Estoque Mínimo')
    )
    
    maximum_stock = models.IntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        verbose_name=_('Estoque Máximo')
    )
    
    # Localização
    location = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('Localização')
    )
    
    shelf = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name=_('Prateleira')
    )
    
    # Status e controle
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name=_('Status')
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
        verbose_name = _('Produto')
        verbose_name_plural = _('Produtos')
        ordering = ['name']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['name']),
            models.Index(fields=['category']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    @property
    def stock_status(self):
        """Retorna o status do estoque."""
        if self.current_stock <= self.minimum_stock:
            return 'low'
        elif self.maximum_stock and self.current_stock >= self.maximum_stock:
            return 'high'
        else:
            return 'normal'
    
    @property
    def needs_restock(self):
        """Verifica se precisa reabastecer."""
        return self.current_stock <= self.minimum_stock
    
    @property
    def stock_percentage(self):
        """Calcula a porcentagem do estoque em relação ao máximo."""
        if not self.maximum_stock or self.maximum_stock == 0:
            return 0
        return (self.current_stock / self.maximum_stock) * 100


class StockMovement(models.Model):
    """Movimentação de estoque."""
    
    MOVEMENT_TYPES = [
        ('in', _('Entrada')),
        ('out', _('Saída')),
        ('adjustment', _('Ajuste')),
        ('transfer', _('Transferência')),
    ]
    
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        verbose_name=_('Produto')
    )
    
    movement_type = models.CharField(
        max_length=20,
        choices=MOVEMENT_TYPES,
        verbose_name=_('Tipo de Movimentação')
    )
    
    quantity = models.IntegerField(
        verbose_name=_('Quantidade')
    )
    
    previous_stock = models.IntegerField(
        verbose_name=_('Estoque Anterior')
    )
    
    current_stock = models.IntegerField(
        verbose_name=_('Estoque Atual')
    )
    
    reference = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('Referência')
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Observações')
    )
    
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        verbose_name=_('Criado por')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Data de criação')
    )
    
    class Meta:
        verbose_name = _('Movimentação de Estoque')
        verbose_name_plural = _('Movimentações de Estoque')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product', 'created_at']),
            models.Index(fields=['movement_type', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.product.code} - {self.get_movement_type_display()} - {self.quantity}"
    
    def save(self, *args, **kwargs):
        if not self.pk:  # Nova movimentação
            self.previous_stock = self.product.current_stock
            if self.movement_type == 'in':
                self.current_stock = self.previous_stock + self.quantity
            elif self.movement_type == 'out':
                self.current_stock = self.previous_stock - self.quantity
            elif self.movement_type == 'adjustment':
                self.current_stock = self.quantity
            elif self.movement_type == 'transfer':
                self.current_stock = self.previous_stock + self.quantity
            
            # Atualiza o estoque do produto
            self.product.current_stock = self.current_stock
            self.product.save(update_fields=['current_stock'])
        
        super().save(*args, **kwargs)
