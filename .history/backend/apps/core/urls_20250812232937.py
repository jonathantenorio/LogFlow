"""
URLs para a aplicação core.
"""

from django.urls import path
from .views import ExcelUploadView, ExcelProcessView, system_stats

app_name = 'core'

urlpatterns = [
    # Upload e processamento de Excel
    path('upload/excel/', ExcelUploadView.as_view(), name='excel_upload'),
    path('upload/process/', ExcelProcessView.as_view(), name='excel_process'),
    
    # Estatísticas do sistema
    path('stats/', system_stats, name='system_stats'),
]
